
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answerId: string, isCorrect: boolean, timeTaken: number) => void;
  showExplanation: boolean;
  timeRemaining: number;
  isActive: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  showExplanation,
  timeRemaining,
  isActive
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  
  // Reset states when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setStartTime(Date.now());
    setTimeLeft(question.timeLimit);
  }, [question]);
  
  // Timer logic
  useEffect(() => {
    if (!isActive || isAnswered) return;
    
    if (timeRemaining <= 0) {
      setIsAnswered(true);
      onAnswer('', false, question.timeLimit);
      return;
    }
    
    setTimeLeft(timeRemaining);
  }, [timeRemaining, isActive, isAnswered, onAnswer, question.timeLimit]);
  
  const handleAnswerClick = (answerId: string) => {
    if (isAnswered) return;
    
    const isCorrect = question.options.find(opt => opt.id === answerId)?.isCorrect || false;
    const timeTaken = Math.min((Date.now() - startTime) / 1000, question.timeLimit);
    
    setSelectedAnswer(answerId);
    setIsAnswered(true);
    
    onAnswer(answerId, isCorrect, timeTaken);
  };
  
  const getProgressBarColor = () => {
    const percentRemaining = (timeLeft / question.timeLimit) * 100;
    if (percentRemaining > 66) return 'bg-green-500';
    if (percentRemaining > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getButtonStyles = (optionId: string) => {
    if (!isAnswered) {
      return selectedAnswer === optionId
        ? 'border-quiz-purple bg-quiz-purple/20 text-white'
        : 'border-quiz-purple/30 hover:bg-quiz-purple/20 hover:border-quiz-purple';
    }
    
    const isCorrect = question.options.find(opt => opt.id === optionId)?.isCorrect;
    const isSelected = selectedAnswer === optionId;
    
    if (isCorrect) {
      return 'border-green-500 bg-green-500/20 text-white';
    }
    
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-500/20 text-white';
    }
    
    return 'border-quiz-purple/30 opacity-60';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="cyber-box w-full max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-foreground/70">
            {question.category} • {question.difficulty.toUpperCase()}
          </span>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-foreground/70" />
            <span className="text-sm font-mono">
              {Math.floor(timeLeft)}s
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-quiz-dark/50 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", getProgressBarColor())}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / question.timeLimit) * 100}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold mb-2 neon-text">
          {question.text}
        </h3>
        
        {question.image && (
          <div className="my-4 rounded-lg overflow-hidden border border-quiz-purple/30">
            <img 
              src={question.image} 
              alt="Question" 
              className="w-full h-auto max-h-48 object-contain bg-quiz-dark/50" 
            />
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {question.options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => handleAnswerClick(option.id)}
            disabled={isAnswered}
            className={cn(
              "w-full py-3 px-4 rounded-md border text-left transition-all",
              getButtonStyles(option.id)
            )}
            whileHover={!isAnswered ? { scale: 1.02 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full border inline-flex items-center justify-center mr-3">
                {option.id.toUpperCase()}
              </span>
              <span>{option.text}</span>
              
              {isAnswered && option.isCorrect && (
                <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
              )}
              
              {isAnswered && selectedAnswer === option.id && !option.isCorrect && (
                <XCircle className="ml-auto h-5 w-5 text-red-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
      
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 border border-quiz-teal/30 bg-quiz-teal/5 rounded-md"
          >
            <h4 className="text-lg font-bold mb-2 flex items-center text-quiz-teal">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Explanation
            </h4>
            <p>{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-6 text-right">
        <p className="text-sm text-foreground/70">
          Points: {question.points} • Time: {question.timeLimit}s
        </p>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
