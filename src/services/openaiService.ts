import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface ExplanationResponse {
  explanation: string;
  studyTips?: string[];
  relatedConcepts?: string[];
}

export class OpenAIService {
  static async generateExplanation(
    question: string,
    options: { letter: string; text: string }[],
    correctAnswer: string,
    userAnswer: string
  ): Promise<ExplanationResponse> {
    try {
      const isCorrect = userAnswer === correctAnswer;
      const correctOption = options.find(opt => opt.letter === correctAnswer);
      const userOption = options.find(opt => opt.letter === userAnswer);

      const prompt = `You are a helpful study tutor using the gpt-5-nano-2025-08-07 model. A student has answered a multiple-choice question.

Question: ${question}

Options:
${options.map(opt => `${opt.letter}. ${opt.text}`).join('\n')}

Correct Answer: ${correctAnswer}. ${correctOption?.text}
Student's Answer: ${userAnswer}. ${userOption?.text}

${isCorrect 
  ? `The student got it RIGHT! Provide a brief, encouraging explanation of why this is the correct answer.`
  : `The student got it WRONG. Explain why their answer "${userAnswer}" is incorrect and why "${correctAnswer}" is the correct answer. Be encouraging and help them understand the concept.`}

Keep your response concise (2-3 sentences max) and educational. Focus on the key concept that makes the correct answer right.

Also suggest 1-2 quick study tips related to this topic.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Using available model as gpt-5-nano might not be available
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || '';
      
      // Parse the response to extract explanation and study tips
      const lines = content.split('\n').filter(line => line.trim());
      
      // Extract main explanation (first paragraph)
      const explanationEnd = lines.findIndex(line => 
        line.toLowerCase().includes('study tip') || 
        line.toLowerCase().includes('tip:') ||
        line.toLowerCase().includes('remember:')
      );
      
      const explanation = explanationEnd > 0 
        ? lines.slice(0, explanationEnd).join(' ')
        : lines[0] || 'Understanding this concept is key to mastering the subject.';
      
      // Extract study tips
      const studyTips: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.toLowerCase().includes('tip') || line.toLowerCase().includes('remember')) {
          // Clean up the tip text
          const tip = line.replace(/^[\d\-\*•\.]+\s*/, '')
                         .replace(/^(study\s+)?tips?:?\s*/i, '')
                         .replace(/^remember:?\s*/i, '')
                         .trim();
          if (tip) studyTips.push(tip);
        }
      }

      return {
        explanation,
        studyTips: studyTips.length > 0 ? studyTips : [
          'Review this concept in your study materials',
          'Practice similar questions to reinforce your understanding'
        ]
      };
    } catch (error) {
      console.error('Error generating explanation:', error);
      
      // Fallback explanation if API fails
      const isCorrect = userAnswer === correctAnswer;
      return {
        explanation: isCorrect 
          ? `Great job! You correctly identified that ${correctAnswer} is the right answer. This shows good understanding of the concept.`
          : `The correct answer is ${correctAnswer}. Take time to review why this option is correct and how it differs from ${userAnswer}.`,
        studyTips: [
          'Review this topic in your study materials',
          'Try more practice questions on this concept'
        ]
      };
    }
  }

  static async generateQuestionHint(
    question: string,
    options: { letter: string; text: string }[]
  ): Promise<string> {
    try {
      const prompt = `Provide a brief, helpful hint for this question without giving away the answer:

Question: ${question}
Options: ${options.map(opt => `${opt.letter}. ${opt.text}`).join(', ')}

Give a subtle hint that guides thinking without revealing the answer. Keep it to 1 sentence.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
        temperature: 0.7,
      });

      return response.choices[0].message.content || 'Think about the key concepts involved in this question.';
    } catch (error) {
      console.error('Error generating hint:', error);
      return 'Consider each option carefully and eliminate those that don\'t fit.';
    }
  }
}
