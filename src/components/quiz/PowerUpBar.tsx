
import React from 'react';
import { Button } from '@/components/ui/button';
import { PowerUp } from '@/types/quiz';
import { 
  SplitSquareVertical, 
  Clock, 
  HelpCircle, 
  SkipForward, 
  ArrowBigUp, 
  RotateCcw
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PowerUpBarProps {
  availablePowerUps: Record<PowerUp, number>;
  onUsePowerUp: (powerUp: PowerUp) => void;
  disabled?: boolean;
}

const PowerUpBar: React.FC<PowerUpBarProps> = ({
  availablePowerUps,
  onUsePowerUp,
  disabled = false
}) => {
  const powerUpDetails: Record<PowerUp, { icon: React.ReactNode; name: string; description: string; color: string }> = {
    'fifty-fifty': {
      icon: <SplitSquareVertical />,
      name: '50/50',
      description: 'Eliminates two incorrect answers',
      color: 'bg-quiz-purple'
    },
    'time-freeze': {
      icon: <Clock />,
      name: 'Time Freeze',
      description: 'Pauses the timer for 5 seconds',
      color: 'bg-blue-500'
    },
    'hint': {
      icon: <HelpCircle />,
      name: 'Hint',
      description: 'Provides a hint for the current question',
      color: 'bg-yellow-500'
    },
    'skip': {
      icon: <SkipForward />,
      name: 'Skip',
      description: 'Skip the current question (with penalty)',
      color: 'bg-red-500'
    },
    'double-down': {
      icon: <ArrowBigUp />,
      name: 'Double Down',
      description: 'Double the points for correct answer (or lose points if wrong)',
      color: 'bg-green-500'
    },
    'time-steal': {
      icon: <RotateCcw />,
      name: 'Time Steal',
      description: 'Add extra time on correct answer streaks',
      color: 'bg-quiz-teal'
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      <TooltipProvider>
        {(Object.entries(availablePowerUps) as [PowerUp, number][]).map(([powerUp, count]) => (
          <Tooltip key={powerUp}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`relative w-12 h-12 ${count > 0 && !disabled ? 'border-white/20 hover:border-white/40' : 'border-white/10 opacity-50'}`}
                onClick={() => count > 0 && !disabled && onUsePowerUp(powerUp)}
                disabled={count <= 0 || disabled}
              >
                <div className={`absolute inset-0 ${powerUpDetails[powerUp as PowerUp].color} opacity-20 rounded-md`}></div>
                <div className="text-white">
                  {powerUpDetails[powerUp as PowerUp].icon}
                </div>
                <span className="absolute -top-2 -right-2 text-xs bg-background border border-white/20 rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="text-center">
                <p className="font-bold">{powerUpDetails[powerUp as PowerUp].name}</p>
                <p className="text-xs">{powerUpDetails[powerUp as PowerUp].description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default PowerUpBar;
