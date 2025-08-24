import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import FileUpload from './components/FileUpload';
import { DocumentParser } from './utils/documentParser';
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

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const extractedQuestions = await DocumentParser.parseDocument(file);
      
      if (extractedQuestions.length === 0) {
        throw new Error('No questions found in the document. Please check the format.');
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
      {/* Animated Background Elements - Optimized with will-change */}
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
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Study Buddy
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Transform your study materials into interactive quizzes with AI-powered explanations.
          </p>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mt-4"
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </motion.div>

        <FileUpload 
          onFileUpload={handleFileUpload} 
          isLoading={isLoading}
          error={error}
        />

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-800">AI Explanations</h3>
            <p className="text-sm text-gray-600 mt-1">
              Get personalized explanations for incorrect answers
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-gray-800">Interactive Quiz</h3>
            <p className="text-sm text-gray-600 mt-1">
              Track progress with streaks, timers, and instant feedback
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-800">Responsive Design</h3>
            <p className="text-sm text-gray-600 mt-1">
              Study anywhere on phone, tablet, or laptop
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;