import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Home } from 'lucide-react';
import { Question } from '../types/quiz';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';

interface QuizViewProps {
  questions: Question[];
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>({});
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionId = currentQuestion.id;

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: answer,
    }));
  };

  const handleToggleAnswer = () => {
    setShowAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: !prev[currentQuestionId],
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowAnswers({});
    setCurrentQuestionIndex(0);
  };

  const handleToggleGrid = () => {
    setShowQuestionGrid(!showQuestionGrid);
  };

  // Calculate statistics
  const answeredQuestions = Object.keys(userAnswers).length;
  const correctAnswers = Object.entries(userAnswers).filter(
    ([questionId, answer]) => {
      const question = questions.find((q) => q.id === parseInt(questionId));
      return question?.correctAnswer === answer;
    }
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">Study Buddy</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Upload New</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">{questions.length}</p>
            <p className="text-sm text-gray-600">Total Questions</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{answeredQuestions}</p>
            <p className="text-sm text-gray-600">Answered</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600">
              {answeredQuestions > 0
                ? Math.round((correctAnswers / answeredQuestions) * 100) + '%'
                : '-'}
            </p>
            <p className="text-sm text-gray-600">Accuracy</p>
          </div>
        </motion.div>

        {/* Question Display */}
        <AnimatePresence mode="wait">
          <QuizQuestion
            key={currentQuestionId}
            question={currentQuestion}
            selectedAnswer={userAnswers[currentQuestionId]}
            showAnswer={showAnswers[currentQuestionId] || false}
            onAnswerSelect={handleAnswerSelect}
            onToggleAnswer={handleToggleAnswer}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8">
          <QuizNavigation
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSelectQuestion={handleSelectQuestion}
            onReset={handleReset}
            userAnswers={userAnswers}
            showQuestionGrid={showQuestionGrid}
            onToggleGrid={handleToggleGrid}
          />
        </div>
      </main>
    </div>
  );
};

export default QuizView;
