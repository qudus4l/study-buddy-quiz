import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Home, Trophy, Target, Clock, RefreshCw, Volume2, VolumeX, Menu, X, Shuffle } from 'lucide-react';
import { Question } from '../types/quiz';
import { shuffleArray } from '../utils/shuffleArray';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';

interface QuizViewProps {
  questions: Question[];
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions: initialQuestions, onBack }) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>({});
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasBeenReshuffled, setHasBeenReshuffled] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionId = currentQuestion.id;

  // Study timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setStudyTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Play sound effect
  const playSound = (type: 'correct' | 'incorrect' | 'select') => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = type === 'correct' ? 800 : type === 'incorrect' ? 300 : 500;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: answer,
    }));
    playSound('select');
  };

  const handleToggleAnswer = () => {
    const newShowState = !showAnswers[currentQuestionId];
    setShowAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: newShowState,
    }));

    if (newShowState && userAnswers[currentQuestionId]) {
      const isCorrect = userAnswers[currentQuestionId] === currentQuestion.correctAnswer;
      if (isCorrect) {
        setStreak(prev => prev + 1);
        playSound('correct');
      } else {
        setStreak(0);
        playSound('incorrect');
      }
    }
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
    setStreak(0);
    setStudyTime(0);
  };

  const handleToggleGrid = () => {
    setShowQuestionGrid(!showQuestionGrid);
  };

  const handleReshuffle = () => {
    // Save current question to find it after shuffle
    const currentQ = questions[currentQuestionIndex];
    
    // Shuffle questions
    const shuffled = shuffleArray(questions);
    setQuestions(shuffled);
    
    // Find the new index of the current question
    const newIndex = shuffled.findIndex(q => q.id === currentQ.id);
    setCurrentQuestionIndex(newIndex !== -1 ? newIndex : 0);
    
    setHasBeenReshuffled(true);
    
    // Play sound effect if enabled
    if (soundEnabled) {
      playSound('select');
    }
  };

  // Calculate statistics
  const answeredQuestions = Object.keys(userAnswers).length;
  const correctAnswers = Object.entries(userAnswers).filter(
    ([questionId, answer]) => {
      const question = questions.find((q) => q.id === parseInt(questionId));
      return question?.correctAnswer === answer;
    }
  ).length;
  
  const accuracy = answeredQuestions > 0 
    ? Math.round((correctAnswers / answeredQuestions) * 100) 
    : 0;

  // Format study time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get motivational message based on performance
  const getMotivationalMessage = () => {
    if (streak >= 5) return "🔥 On fire!";
    if (streak >= 3) return "💪 Great!";
    if (accuracy >= 80) return "🌟 Excellent!";
    if (accuracy >= 60) return "👍 Good!";
    return "📚 Keep going!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Motivational Message */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              <h1 className="text-base sm:text-xl font-bold text-gray-900 hidden sm:block">Study Buddy</h1>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                {getMotivationalMessage()}
              </span>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReshuffle}
                className="p-2 rounded-lg hover:bg-indigo-100 transition-colors group relative"
                title="Reshuffle Questions"
              >
                <Shuffle className={`w-5 h-5 text-indigo-600 ${hasBeenReshuffled ? '' : 'group-hover:animate-spin'}`} />
                {hasBeenReshuffled && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>

              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-mono text-gray-700">
                  {formatTime(studyTime)}
                </span>
              </div>

              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-1 px-3 py-1 bg-orange-50 rounded-lg"
                >
                  <span className="text-lg">🔥</span>
                  <span className="text-sm font-bold text-orange-600">{streak}</span>
                </motion.div>
              )}

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

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Timer (always visible on mobile) */}
              <div className="flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded text-xs">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="font-mono text-gray-700">{formatTime(studyTime)}</span>
              </div>
              
              {/* Streak (if active) */}
              {streak > 0 && (
                <div className="flex items-center px-2 py-1 bg-orange-50 rounded">
                  <span className="text-xs">🔥{streak}</span>
                </div>
              )}

              {/* Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t py-3 space-y-2"
              >
                <button
                  onClick={() => {
                    handleReshuffle();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-indigo-50 rounded"
                >
                  <Shuffle className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm">Reshuffle Questions</span>
                  {hasBeenReshuffled && (
                    <span className="text-xs text-indigo-500 ml-auto">✓</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                </button>
                
                <button
                  onClick={() => {
                    onBack();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded"
                >
                  <Home className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Upload New</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content - Mobile Optimized */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Mobile-Optimized Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-sm sm:shadow-md border border-indigo-100"
          >
            <div className="flex flex-col items-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mb-1 sm:mb-2" />
              <p className="text-lg sm:text-2xl font-bold text-indigo-600">{questions.length}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-sm sm:shadow-md border border-green-100"
          >
            <div className="flex flex-col items-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mb-1 sm:mb-2" />
              <p className="text-lg sm:text-2xl font-bold text-green-600">{answeredQuestions}</p>
              <p className="text-xs text-gray-600">Done</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-sm sm:shadow-md border border-purple-100"
          >
            <div className="flex flex-col items-center">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mb-1 sm:mb-2" />
              <p className="text-lg sm:text-2xl font-bold text-purple-600">
                {accuracy}%
              </p>
              <p className="text-xs text-gray-600">Score</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-sm sm:shadow-md border border-orange-100"
          >
            <div className="flex flex-col items-center">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mb-1 sm:mb-2" />
              <p className="text-lg sm:text-2xl font-bold text-orange-600">{correctAnswers}</p>
              <p className="text-xs text-gray-600">Right</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress Indicator - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Q{currentQuestionIndex + 1}/{questions.length}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

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

        {/* Navigation - Mobile Optimized */}
        <div className="mt-4 sm:mt-8">
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

        {/* Completion Message - Mobile Optimized */}
        {answeredQuestions === questions.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-center shadow-xl"
          >
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Quiz Complete! 🎉</h2>
            <p className="text-base sm:text-lg mb-1">
              You scored {correctAnswers} out of {questions.length} ({accuracy}%)
            </p>
            <p className="text-xs sm:text-sm opacity-90">
              Study time: {formatTime(studyTime)}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default QuizView;