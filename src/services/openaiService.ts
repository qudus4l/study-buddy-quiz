import OpenAI from 'openai';

// Initialize OpenAI with error handling
const initOpenAI = () => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('OpenAI API key not configured. AI features will be limited.');
    return null;
  }
  
  try {
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI:', error);
    return null;
  }
};

const openai = initOpenAI();

// Cache for storing generated explanations to avoid duplicate API calls
const explanationCache = new Map<string, ExplanationResponse>();
const hintCache = new Map<string, string>();

export interface ExplanationResponse {
  explanation: string;
  studyTips?: string[];
  relatedConcepts?: string[];
}

export class OpenAIService {
  private static getCacheKey(question: string, userAnswer: string, correctAnswer: string): string {
    return `${question}-${userAnswer}-${correctAnswer}`;
  }

  static async generateExplanation(
    question: string,
    options: { letter: string; text: string }[],
    correctAnswer: string,
    userAnswer: string
  ): Promise<ExplanationResponse> {
    // Check cache first
    const cacheKey = this.getCacheKey(question, userAnswer, correctAnswer);
    if (explanationCache.has(cacheKey)) {
      return explanationCache.get(cacheKey)!;
    }

    // If OpenAI is not initialized, return fallback
    if (!openai) {
      const fallback = this.getFallbackExplanation(correctAnswer, userAnswer);
      explanationCache.set(cacheKey, fallback);
      return fallback;
    }

    try {
      // This function should only be called for incorrect answers to save API credits
      const correctOption = options.find(opt => opt.letter === correctAnswer);
      const userOption = options.find(opt => opt.letter === userAnswer);

      const prompt = `You are a helpful study tutor. A student has answered a multiple-choice question incorrectly.

Question: ${question}

Options:
${options.map(opt => `${opt.letter}. ${opt.text}`).join('\n')}

Correct Answer: ${correctAnswer}. ${correctOption?.text}
Student's Wrong Answer: ${userAnswer}. ${userOption?.text}

Explain why their answer "${userAnswer}" is incorrect and why "${correctAnswer}" is the correct answer. Be encouraging and help them understand the concept.

Keep your response concise (2-3 sentences max) and educational. Focus on the key concept that makes the correct answer right.

Also suggest 1-2 quick study tips related to this topic.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
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

      const result = {
        explanation,
        studyTips: studyTips.length > 0 ? studyTips : [
          'Review this concept in your study materials',
          'Practice similar questions to reinforce your understanding'
        ]
      };

      // Cache the result
      explanationCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error generating explanation:', error);
      
      // Return fallback and cache it
      const fallback = this.getFallbackExplanation(correctAnswer, userAnswer);
      explanationCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  private static getFallbackExplanation(correctAnswer: string, userAnswer: string): ExplanationResponse {
    return {
      explanation: `The correct answer is ${correctAnswer}. Your answer ${userAnswer} was not quite right. Take time to review why ${correctAnswer} is correct and understand the key differences between the options.`,
      studyTips: [
        'Review this topic in your study materials',
        'Try more practice questions on this concept'
      ]
    };
  }

  static async generateQuestionHint(
    question: string,
    options: { letter: string; text: string }[]
  ): Promise<string> {
    // Check cache first
    const cacheKey = question;
    if (hintCache.has(cacheKey)) {
      return hintCache.get(cacheKey)!;
    }

    // If OpenAI is not initialized, return fallback
    if (!openai) {
      const fallback = 'Consider each option carefully and eliminate those that don\'t fit.';
      hintCache.set(cacheKey, fallback);
      return fallback;
    }

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

      const hint = response.choices[0].message.content || 'Think about the key concepts involved in this question.';
      
      // Cache the hint
      hintCache.set(cacheKey, hint);
      return hint;
    } catch (error) {
      console.error('Error generating hint:', error);
      const fallback = 'Consider each option carefully and eliminate those that don\'t fit.';
      hintCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  // Clear cache method for memory management
  static clearCache() {
    explanationCache.clear();
    hintCache.clear();
  }
}