import React from 'react';
import { ChevronLeft, ChevronRight, Grid, RotateCcw, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  // Keyboard shortcuts hint
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && currentIndex < totalQuestions - 1) {
        onNext();
      } else if (e.key === 'g' || e.key === 'G') {
        onToggleGrid();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, totalQuestions, onPrevious, onNext, onToggleGrid]);

  const getQuestionStatus = (index: number) => {
    const questionId = index + 1;
    const isAnswered = userAnswers[questionId] !== undefined;
    const isCurrent = index === currentIndex;
    
    if (isCurrent) return 'current';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 ring-offset-2';
      case 'answered':
        return 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300';
    }
  };

  return (
    <>
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`
              flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm
              ${
                currentIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
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
              flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-md
              ${
                currentIndex === totalQuestions - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
              }
            `}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Keyboard Shortcuts Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-500"
          >
            <Keyboard className="w-3 h-3" />
            <span>← → to navigate, G for grid</span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: showQuestionGrid ? -90 : 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleGrid}
            className={`p-2.5 rounded-xl border-2 transition-all ${
              showQuestionGrid 
                ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            title="Question Grid (G)"
          >
            <Grid className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="p-2.5 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
            title="Reset Quiz"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Question Grid */}
      <AnimatePresence>
        {showQuestionGrid && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-6 bg-white rounded-xl shadow-xl border border-gray-200"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Jump to Question</h3>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-gray-500">Answered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                  <span className="text-gray-500">Current</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                  <span className="text-gray-500">Not Answered</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const status = getQuestionStatus(i);
                const isAnswered = userAnswers[i + 1] !== undefined;

                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { delay: i * 0.01 }
                    }}
                    onClick={() => {
                      onSelectQuestion(i);
                      onToggleGrid();
                    }}
                    className={`
                      relative w-10 h-10 rounded-lg font-semibold text-sm transition-all
                      flex items-center justify-center
                      ${getStatusColor(status)}
                    `}
                  >
                    {i + 1}
                    {isAnswered && status !== 'current' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Stats in Grid */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-around text-sm">
              <div className="text-center">
                <p className="font-semibold text-green-600">{Object.keys(userAnswers).length}</p>
                <p className="text-xs text-gray-500">Answered</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-600">{totalQuestions - Object.keys(userAnswers).length}</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-indigo-600">
                  {Math.round((Object.keys(userAnswers).length / totalQuestions) * 100)}%
                </p>
                <p className="text-xs text-gray-500">Progress</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuizNavigation;