import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, EyeOff, Lightbulb, Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { Question } from '../types/quiz';
import { OpenAIService, ExplanationResponse } from '../services/openaiService';

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
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState<string>('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  useEffect(() => {
    // Reset states when question changes
    setExplanation(null);
    setShowHint(false);
    setHint('');
  }, [question.id]);

  useEffect(() => {
    // Generate explanation only when answer is revealed AND incorrect
    if (showAnswer && selectedAnswer && !explanation && !isCorrect) {
      generateExplanation();
    }
  }, [showAnswer, selectedAnswer, isCorrect]);

  const generateExplanation = async () => {
    if (!selectedAnswer) return;
    
    setIsLoadingExplanation(true);
    try {
      const response = await OpenAIService.generateExplanation(
        question.text,
        question.options,
        question.correctAnswer,
        selectedAnswer
      );
      setExplanation(response);
    } catch (error) {
      console.error('Failed to generate explanation:', error);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleGetHint = async () => {
    if (hint) {
      setShowHint(!showHint);
      return;
    }

    setIsLoadingHint(true);
    try {
      const hintText = await OpenAIService.generateQuestionHint(
        question.text,
        question.options
      );
      setHint(hintText);
      setShowHint(true);
    } catch (error) {
      console.error('Failed to generate hint:', error);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const getConfidenceColor = (letter: string) => {
    if (!showAnswer) {
      return selectedAnswer === letter 
        ? 'border-indigo-500 bg-indigo-50 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
    }
    
    if (letter === question.correctAnswer) {
      return 'border-green-500 bg-green-50 shadow-md';
    }
    if (selectedAnswer === letter && !isCorrect) {
      return 'border-red-500 bg-red-50';
    }
    return 'border-gray-200 bg-gray-50 opacity-60';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full filter blur-3xl opacity-30 -z-10" />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1"
            >
              <span className="text-xs">📝</span>
              Question {question.questionNumber}
            </motion.span>
            
            {!selectedAnswer && !showAnswer && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetHint}
                disabled={isLoadingHint}
                className="flex items-center space-x-1 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors"
              >
                <Lightbulb className="w-3 h-3" />
                <span>{isLoadingHint ? 'Loading...' : showHint ? 'Hide Hint' : 'Get Hint'}</span>
              </motion.button>
            )}
          </div>

          {selectedAnswer && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleAnswer}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-gray-50 px-3 py-1 rounded-full hover:bg-indigo-50"
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
            </motion.button>
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question.text}
        </h2>

        {/* Hint Display */}
        <AnimatePresence>
          {showHint && hint && !selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.letter;
          const isCorrectOption = option.letter === question.correctAnswer;
          const showCorrectness = showAnswer && selectedAnswer;

          return (
            <motion.button
              key={option.letter}
              whileHover={!showAnswer ? { scale: 1.01, x: 4 } : {}}
              whileTap={!showAnswer ? { scale: 0.99 } : {}}
              onClick={() => !showAnswer && onAnswerSelect(option.letter)}
              disabled={showAnswer}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-300
                ${getConfidenceColor(option.letter)}
                ${showAnswer ? 'cursor-default' : 'cursor-pointer'}
                relative group
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.span
                    animate={isSelected && !showAnswer ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm
                      transition-all duration-300
                      ${
                        isSelected && !showAnswer
                          ? 'bg-indigo-500 text-white shadow-md'
                          : showCorrectness && isCorrectOption
                          ? 'bg-green-500 text-white shadow-md'
                          : showCorrectness && isSelected && !isCorrectOption
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                      }
                    `}
                  >
                    {option.letter}
                  </motion.span>
                  <span className={`text-gray-700 ${showAnswer && !isCorrectOption && !isSelected ? 'opacity-60' : ''}`}>
                    {option.text}
                  </span>
                </div>
                {showCorrectness && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {isCorrectOption && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {isSelected && !isCorrectOption && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showAnswer && selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Result Banner */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`p-4 rounded-xl ${
                isCorrect 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              } text-white shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isCorrect ? (
                    <>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 0.5 }}
                      >
                        <TrendingUp className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-lg">Excellent! 🎉</p>
                        <p className="text-sm opacity-90">You got it right!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Brain className="w-6 h-6" />
                      <div>
                        <p className="font-bold text-lg">Learning Opportunity! 💡</p>
                        <p className="text-sm opacity-90">
                          The correct answer is <strong>{question.correctAnswer}</strong>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* AI Explanation - Only for incorrect answers */}
            {!isCorrect && isLoadingExplanation ? (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"></div>
                  <p className="text-gray-600">Generating explanation...</p>
                </div>
              </div>
            ) : !isCorrect && explanation ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                {/* Explanation Box */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-indigo-900">Understanding the Answer:</p>
                      <p className="text-sm text-indigo-800 leading-relaxed">
                        {explanation.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Study Tips */}
                {explanation.studyTips && explanation.studyTips.length > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-amber-900">Study Tips:</p>
                        <ul className="space-y-1">
                          {explanation.studyTips.map((tip, index) => (
                            <li key={index} className="text-sm text-amber-800 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : isCorrect ? (
              // Simple success message for correct answers (no API call needed)
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-green-900">Perfect! You nailed it!</p>
                    <p className="text-sm text-green-800">
                      Great understanding of this concept. Keep up the excellent work!
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizQuestion;