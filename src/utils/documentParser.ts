import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { Question, Option } from '../types/quiz';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class DocumentParser {
  private static extractQuestionsFromText(text: string): Question[] {
    const questions: Question[] = [];
    
    // Split text into lines for processing
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line);
    
    let currentQuestion: Partial<Question> | null = null;
    let questionText = '';
    let options: Option[] = [];
    let collectingQuestion = false;
    let questionCounter = 0;
    
    // First, look for answer key section if it exists
    const answerKey: { [key: number]: string } = {};
    let answerSectionStart = -1;
    
    // Check if this is SHIT.docx format with inline answers
    const hasInlineAnswers = lines.some(line => 
      line.match(/^\d+\)\s*Q\./i) || line.match(/[A-E]\..*\s+[A-E]\s*$/)
    );
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('answer key') || 
          lines[i].toLowerCase().includes('answers:') ||
          lines[i].toLowerCase().includes('correct answers')) {
        answerSectionStart = i;
        break;
      }
    }
    
    if (answerSectionStart !== -1) {
      for (let i = answerSectionStart + 1; i < lines.length; i++) {
        const answerLine = lines[i].match(/(\d+)[\s.:)]*([A-E])/i);
        if (answerLine) {
          answerKey[parseInt(answerLine[1])] = answerLine[2].toUpperCase();
        }
      }
    }
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Stop processing if we hit the answer key section
      if (answerSectionStart !== -1 && i >= answerSectionStart) {
        break;
      }
      
      // Check if line starts with a question number - updated patterns for new formats
      const questionMatch = line.match(/^(\d+)\)\s*Q\.\s*(.+)/i) ||  // SHIT.docx format: 1)Q. or 1) Q.
                           line.match(/^(\d+)\)\s*(.+)/) ||              // PDF format: 1) Question
                           line.match(/^(?:Question\s*)?(\d+)[.:)\s]+(.+)/i) ||
                           line.match(/^(\d+)\.\s*(.+)/) ||
                           line.match(/^Q(\d+)[:.\s]+(.+)/i) ||
                           line.match(/^Q:\s*(.+)/i);  // Handle "Q:" format without number
      
      if (questionMatch) {
        // Save previous question if exists
        if (currentQuestion && questionText && options.length > 0) {
          currentQuestion.text = questionText.trim();
          currentQuestion.options = options;
          
          // Only look for answer if we haven't found it already
          if (!currentQuestion.correctAnswer) {
            const answer = answerKey[currentQuestion.questionNumber!];
            if (answer) {
              currentQuestion.correctAnswer = answer;
            }
          }
          
          questions.push(currentQuestion as Question);
        }
        
        // Start new question
        let questionNumber: number;
        let qText: string;
        
        if (questionMatch[1] && !isNaN(parseInt(questionMatch[1]))) {
          // Has a number
          questionNumber = parseInt(questionMatch[1]);
          qText = questionMatch[2] || '';
        } else {
          // No number (Q: format)
          questionCounter++;
          questionNumber = questionCounter;
          qText = questionMatch[1] || questionMatch[2] || '';
        }
        
        currentQuestion = {
          id: questionNumber,
          questionNumber: questionNumber,
          text: '',
          options: [],
          correctAnswer: ''
        };
        
        questionText = qText;
        options = [];
        collectingQuestion = true;
        continue;
      }
      
      // Check for options - handle various formats including lowercase
      const optionMatch = line.match(/^([A-Ea-e])\)\s*(.+)/i) ||      // PDF format: A) option
                         line.match(/^([A-Ea-e])\.\s*(.+)/i) ||       // DOCX format: A. option
                         line.match(/^([A-Ea-e])[.:)\s]+(.+)/i) ||
                         line.match(/^\(([A-Ea-e])\)\s*(.+)/i);
      
      if (optionMatch && currentQuestion) {
        collectingQuestion = false;
        const letter = optionMatch[1].toUpperCase();
        let text = optionMatch[2].trim();
        
        // Check for inline answer at the end (SHIT.docx format)
        // Format: "D. option text.  C" where C is the answer
        const inlineAnswerMatch = text.match(/^(.+?)\s+([A-E])\s*$/i);
        if (hasInlineAnswers && inlineAnswerMatch) {
          text = inlineAnswerMatch[1].trim();
          currentQuestion.correctAnswer = inlineAnswerMatch[2].toUpperCase();
        }
        
        // Remove any answer indicators from the option text
        text = text.replace(/[✓✔✅]/g, '').trim();
        text = text.replace(/\.\s*[A-E]\s*$/, '.').trim(); // Remove trailing answer letters
        
        // Check if this option is marked as correct
        if (line.includes('✓') || line.includes('✔') || line.includes('✅') || 
            line.includes('(correct)') || line.includes('*')) {
          currentQuestion.correctAnswer = letter;
        }
        
        options.push({ letter, text });
        continue;
      }
      
      // Check for inline answer indicators - handle various formats
      // Pattern matches "Answer: B" or "ANSWER: B" formats
      const answerMatch = line.match(/^Answer\s*:\s*([A-Ea-e])\s*/i) || 
                         line.match(/^ANSWER\s*:\s*([A-Ea-e])\s*/i);
      if (answerMatch && currentQuestion) {
        currentQuestion.correctAnswer = answerMatch[1].toUpperCase();
        collectingQuestion = false;  // Stop collecting question text
        continue;
      }
      
      // Also check for standalone answer letters at end of line (SHIT.docx format)
      if (hasInlineAnswers && currentQuestion && options.length === 4) {
        const standaloneAnswer = line.match(/^([A-E])\s*$/i);
        if (standaloneAnswer) {
          currentQuestion.correctAnswer = standaloneAnswer[1].toUpperCase();
          continue;
        }
      }
      
      // If we're collecting question text and haven't hit options yet
      if (collectingQuestion && currentQuestion && !optionMatch && !answerMatch) {
        // Don't add lines that look like they might be instructions or headers or metadata
        if (!line.toLowerCase().includes('instructions') && 
            !line.toLowerCase().includes('section') &&
            !line.toLowerCase().includes('part') &&
            !line.match(/^(Diff:|Skill:|Objective:|Learning Outcome:|AACSB:)/i) &&
            line.length > 2) {
          questionText += ' ' + line;
        }
      }
      
      // Skip metadata lines from PDFs
      if (line.match(/^(Diff:|Skill:|Objective:|Learning Outcome:|AACSB:)/i)) {
        continue;
      }
    }
    
    // Don't forget the last question
    if (currentQuestion && questionText && options.length > 0) {
      currentQuestion.text = questionText.trim();
      currentQuestion.options = options;
      
      // Try to find the answer from answer key or already set answer
      if (!currentQuestion.correctAnswer) {
        const answer = answerKey[currentQuestion.questionNumber!];
        if (answer) {
          currentQuestion.correctAnswer = answer;
        }
      }
      
      questions.push(currentQuestion as Question);
    }
    
    return questions;
  }
  
  private static findAnswer(lines: string[], startIndex: number, questionNumber: number): string | null {
    // Look ahead for answer pattern
    for (let i = startIndex; i < Math.min(startIndex + 10, lines.length); i++) {
      const line = lines[i];
      
      // Direct answer pattern
      const answerMatch = line.match(/(?:Answer|Correct Answer|Ans)[\s:]*([A-E])/i);
      if (answerMatch) {
        return answerMatch[1].toUpperCase();
      }
      
      // Check for checkmark or other indicators next to options
      const markedOption = line.match(/^([A-E])[.:)].+[✓✔]/i);
      if (markedOption) {
        return markedOption[1].toUpperCase();
      }
    }
    
    // Check if there's an answer key section
    const answerKeyPattern = new RegExp(`${questionNumber}[.\\s:)]*([A-E])`, 'i');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('answer') || lines[i].toLowerCase().includes('key')) {
        for (let j = i; j < Math.min(i + 50, lines.length); j++) {
          const match = lines[j].match(answerKeyPattern);
          if (match) {
            return match[1].toUpperCase();
          }
        }
      }
    }
    
    return null;
  }
  
  static async parseDocx(file: File): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          const questions = this.extractQuestionsFromText(result.value);
          resolve(questions);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  static async parsePdf(file: File): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
          let fullText = '';
          
          // Extract text from all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Concatenate all text items
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            
            fullText += pageText + '\n';
          }
          
          // Clean up the text - handle PDF text extraction quirks
          fullText = fullText
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .replace(/([A-E])\)\s*/g, '\n$1) ')  // Ensure options start on new lines
            .replace(/(\d+)\)\s*/g, '\n$1) ')  // Ensure questions start on new lines
            .replace(/Answer\s*:\s*/gi, '\nAnswer: ')  // Ensure answers are on new lines
            .replace(/\s*(Diff:|Skill:|Objective:|Learning Outcome:|AACSB:)/gi, '\n$1');  // Separate metadata
          
          const questions = this.extractQuestionsFromText(fullText);
          resolve(questions);
        } catch (error) {
          console.error('Error parsing PDF:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read PDF file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  static async parseDocument(file: File): Promise<Question[]> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileName.endsWith('.docx')) {
      return this.parseDocx(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return this.parsePdf(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  }
}
