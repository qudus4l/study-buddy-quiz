import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: string | undefined;
  showAnswer: boolean;
  onAnswerSelect: (answer: string) => void;
  onToggleAnswer: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  showAnswer,
  onAnswerSelect,
  onToggleAnswer,
}) => {
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Question {question.questionNumber}
          </span>
          {selectedAnswer && (
            <button
              onClick={onToggleAnswer}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide Answer</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Show Answer</span>
                </>
              )}
            </button>
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.letter;
          const isCorrectOption = option.letter === question.correctAnswer;
          const showCorrectness = showAnswer && selectedAnswer;

          return (
            <motion.button
              key={option.letter}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onAnswerSelect(option.letter)}
              disabled={showAnswer}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                ${
                  isSelected && !showAnswer
                    ? 'border-indigo-500 bg-indigo-50'
                    : showCorrectness && isCorrectOption
                    ? 'border-green-500 bg-green-50'
                    : showCorrectness && isSelected && !isCorrectOption
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${showAnswer ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full font-semibold
                      ${
                        isSelected && !showAnswer
                          ? 'bg-indigo-500 text-white'
                          : showCorrectness && isCorrectOption
                          ? 'bg-green-500 text-white'
                          : showCorrectness && isSelected && !isCorrectOption
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    {option.letter}
                  </span>
                  <span className="text-gray-700">{option.text}</span>
                </div>
                {showCorrectness && (
                  <div>
                    {isCorrectOption && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {isSelected && !isCorrectOption && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showAnswer && selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 rounded-lg"
            style={{
              background: isCorrect 
                ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' 
                : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
            }}
          >
            <div className="text-white">
              <p className="font-semibold mb-1">
                {isCorrect ? '🎉 Correct!' : '💡 Not quite right'}
              </p>
              <p className="text-sm opacity-90">
                The correct answer is <strong>{question.correctAnswer}</strong>
                {question.explanation && (
                  <span className="block mt-2">{question.explanation}</span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizQuestion;
