
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import QuestionCard from '@/components/quiz/QuestionCard';
import PowerUpBar from '@/components/quiz/PowerUpBar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PowerUp, Question, GameState, QuizResult } from '@/types/quiz';
import { mockQuestions } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight, Timer, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ConfettiEffect from '@/components/ui/confetti-effect';
import { useAuth } from '@/contexts/AuthContext';

const QuizGame = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Filter questions for the selected category
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    longestStreak: 0,
    timeRemaining: 0,
    availablePowerUps: user?.powerUps || {
      'fifty-fifty': 2,
      'time-freeze': 1,
      'double-down': 1,
      'hint': 3,
      'skip': 2,
      'time-steal': 1
    },
    usedPowerUps: [],
    answeredQuestions: []
  });
  
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [doubleDown, setDoubleDown] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  
  // Initialize quiz
  useEffect(() => {
    // Filter questions by category if categoryId is provided
    let filteredQuestions = [...mockQuestions];
    if (categoryId) {
      const category = mockQuestions.find(q => q.category.toLowerCase() === categoryId.toLowerCase())?.category;
      if (category) {
        filteredQuestions = mockQuestions.filter(q => q.category === category);
      }
    }
    
    // Shuffle and take 10 questions
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuestions(selected);
    
    // Initialize timer with first question's time limit
    if (selected.length > 0) {
      setGameState(prev => ({
        ...prev,
        timeRemaining: selected[0].timeLimit
      }));
    }
  }, [categoryId]);
  
  // Timer effect
  useEffect(() => {
    if (quizComplete || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          return prev;
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 0.1
        };
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [quizComplete, questions.length]);
  
  const handleAnswer = useCallback((answerId: string, isCorrect: boolean, timeTaken: number) => {
    setShowExplanation(true);
    
    // Calculate points
    let pointsEarned = isCorrect ? Math.round(
      questions[currentQuestionIndex].points * (1 + (questions[currentQuestionIndex].timeLimit - timeTaken) / questions[currentQuestionIndex].timeLimit)
    ) : 0;
    
    // Apply double down if active
    if (doubleDown) {
      pointsEarned = isCorrect ? pointsEarned * 2 : -Math.round(questions[currentQuestionIndex].points / 2);
      setDoubleDown(false);
    }
    
    // Update streak
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    const newLongestStreak = Math.max(newStreak, gameState.longestStreak);
    
    // Time steal power-up: add time if streak is 3 or more
    let timeStealBonus = 0;
    if (isCorrect && newStreak >= 3 && gameState.usedPowerUps.includes('time-steal')) {
      timeStealBonus = 3; // Add 3 seconds
      toast({
        title: "Time Steal Activated!",
        description: `+${timeStealBonus}s added to your time.`,
        variant: "default",
      });
    }
    
    // Show feedback toast
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: `+${pointsEarned} points`,
        variant: "default",
      });
      
      if (newStreak === 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      toast({
        title: "Incorrect!",
        description: pointsEarned < 0 ? `${pointsEarned} points` : "No points awarded",
        variant: "destructive",
      });
    }
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      score: prev.score + pointsEarned,
      streak: newStreak,
      longestStreak: newLongestStreak,
      answeredQuestions: [
        ...prev.answeredQuestions,
        {
          questionId: questions[currentQuestionIndex].id,
          answered: true,
          correct: isCorrect,
          timeTaken
        }
      ]
    }));
    
    // Show explanation for 2.5 seconds before moving to next question
    setTimeout(() => {
      setShowExplanation(false);
      setHintText(null);
      
      // Check if it's the last question
      if (currentQuestionIndex === questions.length - 1) {
        setQuizComplete(true);
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
        // Reset timer for next question
        setGameState(prev => ({
          ...prev,
          timeRemaining: questions[currentQuestionIndex + 1].timeLimit + timeStealBonus
        }));
      }
    }, 2500);
  }, [currentQuestionIndex, doubleDown, gameState, questions, toast]);
  
  const handleUsePowerUp = useCallback((powerUp: PowerUp) => {
    if (gameState.availablePowerUps[powerUp] <= 0) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    switch (powerUp) {
      case 'fifty-fifty':
        // Find the correct answer
        const correctOptionId = currentQuestion.options.find(opt => opt.isCorrect)?.id;
        
        // Find two random incorrect options to eliminate
        const incorrectOptions = currentQuestion.options
          .filter(opt => !opt.isCorrect)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
          .map(opt => opt.id);
        
        // Create a new question with eliminated options
        setQuestions(prev => {
          const newQuestions = [...prev];
          newQuestions[currentQuestionIndex] = {
            ...newQuestions[currentQuestionIndex],
            options: newQuestions[currentQuestionIndex].options.map(opt => ({
              ...opt,
              text: incorrectOptions.includes(opt.id) ? "---" : opt.text,
              isCorrect: opt.isCorrect
            }))
          };
          return newQuestions;
        });
        
        toast({
          title: "50/50 Power-Up",
          description: "Two incorrect answers have been eliminated.",
        });
        break;
        
      case 'time-freeze':
        // Add 5 seconds to the timer
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining + 5
        }));
        
        toast({
          title: "Time Freeze",
          description: "Timer paused for 5 seconds.",
        });
        break;
        
      case 'hint':
        // Find the correct answer and provide a hint
        const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
        if (correctOption) {
          setHintText(`Hint: ${currentQuestion.explanation.split('.')[0]}.`);
          
          toast({
            title: "Hint Revealed",
            description: "A hint has been provided.",
          });
        }
        break;
        
      case 'skip':
        // Skip this question with penalty
        setGameState(prev => ({
          ...prev,
          answeredQuestions: [
            ...prev.answeredQuestions,
            {
              questionId: questions[currentQuestionIndex].id,
              answered: false,
              correct: false,
              timeTaken: currentQuestion.timeLimit
            }
          ],
          streak: 0 // Reset streak on skip
        }));
        
        toast({
          title: "Question Skipped",
          description: "This question has been skipped with a streak penalty.",
          variant: "destructive",
        });
        
        // Move to next question
        if (currentQuestionIndex === questions.length - 1) {
          setQuizComplete(true);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setGameState(prev => ({
            ...prev,
            timeRemaining: questions[currentQuestionIndex + 1].timeLimit
          }));
        }
        break;
        
      case 'double-down':
        // Activate double points for this question
        setDoubleDown(true);
        
        toast({
          title: "Double Down Activated",
          description: "This question will award double points if correct, but will penalize if wrong.",
        });
        break;
        
      case 'time-steal':
        // This power-up is passive, it will add time on streak >= 3
        toast({
          title: "Time Steal Activated",
          description: "You'll gain extra time for each answer in a streak.",
        });
        break;
    }
    
    // Update power-up usage
    setGameState(prev => ({
      ...prev,
      availablePowerUps: {
        ...prev.availablePowerUps,
        [powerUp]: prev.availablePowerUps[powerUp] - 1
      },
      usedPowerUps: [...prev.usedPowerUps, powerUp]
    }));
  }, [currentQuestionIndex, gameState.availablePowerUps, questions, toast]);
  
  // Calculate quiz results when completed
  const quizResults: QuizResult = {
    totalQuestions: questions.length,
    correctAnswers: gameState.answeredQuestions.filter(q => q.correct).length,
    wrongAnswers: gameState.answeredQuestions.filter(q => !q.correct && q.answered).length,
    skippedQuestions: gameState.answeredQuestions.filter(q => !q.answered).length,
    totalPoints: gameState.score,
    totalTime: gameState.answeredQuestions.reduce((sum, q) => sum + q.timeTaken, 0),
    averageResponseTime: gameState.answeredQuestions.length > 0
      ? gameState.answeredQuestions.reduce((sum, q) => sum + q.timeTaken, 0) / gameState.answeredQuestions.length
      : 0,
    longestStreak: gameState.longestStreak,
    powerUpsUsed: gameState.usedPowerUps
  };
  
  // Function to get accuracy percentage
  const getAccuracyPercentage = () => {
    if (quizResults.totalQuestions === 0) return 0;
    return Math.round((quizResults.correctAnswers / quizResults.totalQuestions) * 100);
  };
  
  if (questions.length === 0) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-quiz-purple border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold">Loading Quiz...</h2>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <ConfettiEffect active={showConfetti} />
      
      <div className="py-6 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!quizComplete ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-foreground/70">Question {currentQuestionIndex + 1} of {questions.length}</p>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={(currentQuestionIndex / questions.length) * 100}
                      className="h-2 w-24 md:w-32"
                    />
                    <span className="text-sm font-medium">
                      {Math.round((currentQuestionIndex / questions.length) * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-foreground/70">Score</p>
                  <p className="text-xl font-bold text-quiz-teal">{gameState.score}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {Array(Math.min(gameState.streak, 5)).fill(0).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-quiz-purple text-white text-xs border-2 border-background"
                      >
                        <Check className="h-3 w-3" />
                      </div>
                    ))}
                    
                    {gameState.streak === 0 && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-700 text-white text-xs border-2 border-background">
                        <X className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs text-foreground/70">Streak</p>
                    <p className="text-sm font-bold">{gameState.streak}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-xs text-foreground/70">Time</p>
                    <p className="text-sm font-bold">
                      {Math.max(0, Math.floor(gameState.timeRemaining))}s
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <Timer className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {doubleDown && (
                <div className="py-2 px-4 bg-green-500/20 border border-green-500/30 rounded-md text-center">
                  <p className="text-sm font-bold text-green-400">Double Down Active! Double points for correct answer.</p>
                </div>
              )}
              
              {hintText && (
                <div className="py-2 px-4 bg-yellow-500/20 border border-yellow-500/30 rounded-md">
                  <p className="text-sm text-yellow-300">{hintText}</p>
                </div>
              )}
              
              <div className="my-6">
                <PowerUpBar
                  availablePowerUps={gameState.availablePowerUps}
                  onUsePowerUp={handleUsePowerUp}
                  disabled={showExplanation}
                />
              </div>
              
              <QuestionCard
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                showExplanation={showExplanation}
                timeRemaining={gameState.timeRemaining}
                isActive={!showExplanation}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="cyber-box max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold neon-text mb-2">Quiz Completed!</h2>
                <p className="text-foreground/70">
                  You scored {quizResults.totalPoints} points with {quizResults.correctAnswers} correct answers.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-quiz-dark/50 rounded-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-quiz-purple/20 flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-quiz-purple" />
                  </div>
                  <h3 className="text-lg font-bold text-quiz-purple mb-1">Score</h3>
                  <p className="text-2xl font-bold">{quizResults.totalPoints}</p>
                </div>
                
                <div className="p-4 bg-quiz-dark/50 rounded-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-quiz-teal/20 flex items-center justify-center mx-auto mb-2">
                    <Check className="h-6 w-6 text-quiz-teal" />
                  </div>
                  <h3 className="text-lg font-bold text-quiz-teal mb-1">Accuracy</h3>
                  <p className="text-2xl font-bold">{getAccuracyPercentage()}%</p>
                </div>
                
                <div className="p-4 bg-quiz-dark/50 rounded-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                    <Timer className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-bold text-yellow-500 mb-1">Avg. Time</h3>
                  <p className="text-2xl font-bold">{quizResults.averageResponseTime.toFixed(1)}s</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 neon-text">Detailed Stats</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-quiz-dark/30 rounded-md">
                      <p className="text-sm text-foreground/70">Correct</p>
                      <p className="text-lg font-bold text-green-500">
                        {quizResults.correctAnswers} / {quizResults.totalQuestions}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-quiz-dark/30 rounded-md">
                      <p className="text-sm text-foreground/70">Wrong</p>
                      <p className="text-lg font-bold text-red-500">
                        {quizResults.wrongAnswers} / {quizResults.totalQuestions}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-quiz-dark/30 rounded-md">
                      <p className="text-sm text-foreground/70">Skipped</p>
                      <p className="text-lg font-bold text-yellow-500">
                        {quizResults.skippedQuestions} / {quizResults.totalQuestions}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-quiz-dark/30 rounded-md">
                      <p className="text-sm text-foreground/70">Longest Streak</p>
                      <p className="text-lg font-bold text-quiz-purple">
                        {quizResults.longestStreak}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-quiz-dark/30 rounded-md">
                    <p className="text-sm text-foreground/70 mb-2">Power-Ups Used</p>
                    <div className="flex flex-wrap gap-2">
                      {quizResults.powerUpsUsed.length > 0 ? (
                        quizResults.powerUpsUsed.map((powerUp, index) => (
                          <span 
                            key={index} 
                            className="inline-block px-2 py-1 text-xs rounded-full bg-quiz-purple/20 text-quiz-purple"
                          >
                            {powerUp.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        ))
                      ) : (
                        <span className="text-foreground/70">No power-ups used</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                <Button 
                  className="bg-quiz-purple hover:bg-quiz-purple/80"
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setQuizComplete(false);
                    setGameState({
                      currentQuestionIndex: 0,
                      score: 0,
                      streak: 0,
                      longestStreak: 0,
                      timeRemaining: questions[0].timeLimit,
                      availablePowerUps: user?.powerUps || {
                        'fifty-fifty': 2,
                        'time-freeze': 1,
                        'double-down': 1,
                        'hint': 3,
                        'skip': 2,
                        'time-steal': 1
                      },
                      usedPowerUps: [],
                      answeredQuestions: []
                    });
                    
                    // Shuffle questions for a new game
                    const shuffled = [...mockQuestions].sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 10);
                    setQuestions(selected);
                  }}
                >
                  Play Again
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-quiz-teal text-quiz-teal hover:bg-quiz-teal/10"
                  onClick={() => navigate('/categories')}
                >
                  Try Different Category
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/leaderboard')}
                >
                  View Leaderboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default QuizGame;
