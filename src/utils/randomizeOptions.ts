import { Question, Option } from '../types/quiz';
import { shuffleArray } from './shuffleArray';

/**
 * Randomizes the options within a question while preserving the correct answer
 */
export function randomizeQuestionOptions(question: Question): Question {
  // Find the correct answer option
  const correctOption = question.options.find(opt => opt.letter === question.correctAnswer);
  
  if (!correctOption) {
    // If no correct answer is set, just shuffle without updating correctAnswer
    return {
      ...question,
      options: shuffleArray(question.options).map((opt, index) => ({
        ...opt,
        letter: String.fromCharCode(65 + index) // A, B, C, D, E...
      }))
    };
  }
  
  // Shuffle the options
  const shuffledOptions = shuffleArray(question.options);
  
  // Reassign letters based on new positions
  const newOptions = shuffledOptions.map((opt, index) => ({
    ...opt,
    letter: String.fromCharCode(65 + index) // A, B, C, D, E...
  }));
  
  // Find the new position of the correct answer
  const newCorrectIndex = shuffledOptions.findIndex(opt => 
    opt.text === correctOption.text
  );
  
  // Update the correct answer to the new letter
  const newCorrectAnswer = String.fromCharCode(65 + newCorrectIndex);
  
  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectAnswer
  };
}

/**
 * Randomizes options for all questions in an array
 */
export function randomizeAllOptions(questions: Question[]): Question[] {
  return questions.map(question => randomizeQuestionOptions(question));
}
