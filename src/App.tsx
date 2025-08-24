import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Shuffle, RotateCw } from 'lucide-react';
import FileUpload from './components/FileUpload';
import { DocumentParser } from './utils/documentParser';
import { shuffleArray } from './utils/shuffleArray';
import { randomizeAllOptions } from './utils/randomizeOptions';
import { Question } from './types/quiz';

// Lazy load QuizView for better initial load performance
const QuizView = lazy(() => import('./components/QuizView'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-600">Loading quiz...</p>
    </div>
  </div>
);

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true); // Default to randomized
  const [randomizeOptions, setRandomizeOptions] = useState(true); // Default to randomized options

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      let extractedQuestions = await DocumentParser.parseDocument(file);
      
      if (extractedQuestions.length === 0) {
        throw new Error('No questions found in the document. Please check the format.');
      }

      // Randomize options within each question if enabled
      if (randomizeOptions) {
        extractedQuestions = randomizeAllOptions(extractedQuestions);
        console.log('Options within questions randomized!');
      }

      // Randomize question order if enabled
      if (randomizeQuestions) {
        extractedQuestions = shuffleArray(extractedQuestions);
        console.log('Questions randomized for better learning!');
      }

      setQuestions(extractedQuestions);
      setShowQuiz(true);
      
      console.log(`Successfully extracted ${extractedQuestions.length} questions`);
    } catch (err) {
      console.error('Error parsing document:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUpload = () => {
    setShowQuiz(false);
    setQuestions([]);
    setError(null);
  };

  if (showQuiz && questions.length > 0) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <QuizView questions={questions} onBack={handleBackToUpload} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements - Hidden on mobile for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ willChange: 'transform' }}
          className="hidden sm:block absolute -top-20 -left-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ willChange: 'transform' }}
          className="hidden sm:block absolute -bottom-20 -right-20 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:py-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 mr-2 sm:mr-3" />
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Study Buddy
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-xs sm:max-w-md mx-auto">
            Transform your study materials into interactive quizzes with AI-powered explanations.
          </p>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mt-3 sm:mt-4"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Randomization Toggles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mb-6 flex flex-col items-center space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Question Order Randomization */}
            <button
              onClick={() => setRandomizeQuestions(!randomizeQuestions)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full transition-all transform hover:scale-105
                ${randomizeQuestions 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400'
                }
              `}
            >
              <Shuffle className={`w-4 h-4 ${randomizeQuestions ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">
                {randomizeQuestions ? '🎲 Shuffle Questions' : '📝 Keep Order'}
              </span>
            </button>

            {/* Option Order Randomization */}
            <button
              onClick={() => setRandomizeOptions(!randomizeOptions)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full transition-all transform hover:scale-105
                ${randomizeOptions 
                  ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-400'
                }
              `}
            >
              <RotateCw className={`w-4 h-4 ${randomizeOptions ? 'animate-spin-slow' : ''}`} />
              <span className="text-sm font-medium">
                {randomizeOptions ? '🔄 Shuffle Options' : '🔢 Keep A-B-C-D'}
              </span>
            </button>
          </div>
          
          {(randomizeQuestions || randomizeOptions) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-gray-500 text-center max-w-md"
            >
              {randomizeQuestions && randomizeOptions 
                ? 'Both question order and option positions will be randomized for maximum learning effectiveness'
                : randomizeQuestions 
                ? 'Questions will be shuffled to prevent pattern memorization'
                : 'Option positions (A, B, C, D) will be randomized within each question'}
            </motion.p>
          )}
        </motion.div>

        <FileUpload 
          onFileUpload={handleFileUpload} 
          isLoading={isLoading}
          error={error}
        />

        {/* Features - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-xs sm:max-w-4xl w-full"
        >
          <div className="text-center p-4 sm:p-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">AI Explanations</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Get personalized explanations for incorrect answers
            </p>
          </div>
          <div className="text-center p-4 sm:p-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Interactive Quiz</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Track progress with streaks, timers, and instant feedback
            </p>
          </div>
          <div className="text-center p-4 sm:p-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Mobile Ready</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Study anywhere on phone, tablet, or laptop
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;