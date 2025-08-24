import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Home, Trophy, Target, Clock, RefreshCw, Volume2, VolumeX } from 'lucide-react';
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
  const [studyTime, setStudyTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
    // Sound implementation would go here
    // For now, we'll use the Web Audio API for simple beeps
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

    // Update streak when revealing answer
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
    if (streak >= 5) return "🔥 You're on fire!";
    if (streak >= 3) return "💪 Great streak!";
    if (accuracy >= 80) return "🌟 Excellent work!";
    if (accuracy >= 60) return "👍 Keep going!";
    return "📚 Focus and learn!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">Study Buddy</h1>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm font-medium text-gray-600">
                {getMotivationalMessage()}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sound Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>

              {/* Study Timer */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-mono text-gray-700">
                  {formatTime(studyTime)}
                </span>
              </div>

              {/* Streak Counter */}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Enhanced Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 text-center shadow-md border border-indigo-100"
          >
            <div className="flex flex-col items-center">
              <BookOpen className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-2xl font-bold text-indigo-600">{questions.length}</p>
              <p className="text-xs text-gray-600">Total Questions</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 text-center shadow-md border border-green-100"
          >
            <div className="flex flex-col items-center">
              <Target className="w-5 h-5 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-green-600">{answeredQuestions}</p>
              <p className="text-xs text-gray-600">Answered</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 text-center shadow-md border border-purple-100"
          >
            <div className="flex flex-col items-center">
              <Trophy className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-purple-600">
                {accuracy}%
              </p>
              <p className="text-xs text-gray-600">Accuracy</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 text-center shadow-md border border-orange-100"
          >
            <div className="flex flex-col items-center">
              <RefreshCw className="w-5 h-5 text-orange-500 mb-2" />
              <p className="text-2xl font-bold text-orange-600">{correctAnswers}</p>
              <p className="text-xs text-gray-600">Correct</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
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

        {/* Completion Message */}
        {answeredQuestions === questions.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-center shadow-xl"
          >
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">Quiz Complete! 🎉</h2>
            <p className="text-lg mb-1">
              You scored {correctAnswers} out of {questions.length} ({accuracy}%)
            </p>
            <p className="text-sm opacity-90">
              Study time: {formatTime(studyTime)}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default QuizView;