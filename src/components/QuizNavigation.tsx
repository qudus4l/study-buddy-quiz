import React from 'react';
import { ChevronLeft, ChevronRight, Grid, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectQuestion: (index: number) => void;
  onReset: () => void;
  userAnswers: { [key: number]: string };
  showQuestionGrid: boolean;
  onToggleGrid: () => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSelectQuestion,
  onReset,
  userAnswers,
  showQuestionGrid,
  onToggleGrid,
}) => {
  const answeredCount = Object.keys(userAnswers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {answeredCount} / {totalQuestions} answered
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
              ${
                currentIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            disabled={currentIndex === totalQuestions - 1}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
              ${
                currentIndex === totalQuestions - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }
            `}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleGrid}
            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            title="Question Grid"
          >
            <Grid className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            title="Reset Quiz"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Question Grid */}
      {showQuestionGrid && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-4 p-4 bg-white rounded-lg shadow-lg"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Jump to Question</h3>
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const isAnswered = userAnswers[i + 1] !== undefined;
              const isCurrent = i === currentIndex;

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onSelectQuestion(i);
                    onToggleGrid();
                  }}
                  className={`
                    w-10 h-10 rounded-lg font-medium text-sm transition-all
                    ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {i + 1}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default QuizNavigation;
