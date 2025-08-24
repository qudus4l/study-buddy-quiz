export interface Question {
  id: number;
  questionNumber: number;
  text: string;
  options: Option[];
  correctAnswer: string;
  explanation?: string;
}

export interface Option {
  letter: string;
  text: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: { [questionId: number]: string };
  showAnswer: { [questionId: number]: boolean };
}
