
export type QuestionType = 
  | 'multiple-choice'
  | 'true-false'
  | 'fill-in-blank'
  | 'image-identification'
  | 'audio-recognition'
  | 'sequence-ordering';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type PowerUp = 
  | 'fifty-fifty'
  | 'time-freeze'
  | 'double-down'
  | 'hint'
  | 'skip'
  | 'time-steal';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  image?: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  options: Option[];
  correctAnswer: string | string[];
  explanation: string;
  timeLimit: number;
  points: number;
  image?: string;
  audio?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionCount: number;
  color: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  totalPoints: number;
  totalTime: number;
  averageResponseTime: number;
  longestStreak: number;
  powerUpsUsed: PowerUp[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  totalQuizzes: number;
  totalPoints: number;
  bestScore: number;
  averageAccuracy: number;
  powerUps: Record<PowerUp, number>;
  titles: string[];
  badges: string[];
  friends: string[];
  createdAt: string;
  lastActive: string;
  preferences: {
    theme: 'dark' | 'light';
    soundEffects: boolean;
    musicVolume: number;
    sfxVolume: number;
    hapticFeedback: boolean;
    motionReduction: boolean;
    colorblindMode: boolean | string;
  };
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  level: number;
  score: number;
  position: number;
  change: number; // position change since last update
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  longestStreak: number;
  timeRemaining: number;
  availablePowerUps: Record<PowerUp, number>;
  usedPowerUps: PowerUp[];
  answeredQuestions: {
    questionId: string;
    answered: boolean;
    correct: boolean;
    timeTaken: number;
  }[];
}
