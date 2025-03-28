
import { Question, Category, UserProfile, LeaderboardEntry } from '../types/quiz';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Science & Tech',
    icon: 'flask',
    description: 'Test your knowledge of scientific discoveries and technological innovations',
    questionCount: 150,
    color: '#6C00FF'
  },
  {
    id: '2',
    name: 'Pop Culture',
    icon: 'film',
    description: 'Questions about movies, music, TV shows, and celebrities',
    questionCount: 125,
    color: '#00FFE0'
  },
  {
    id: '3',
    name: 'History',
    icon: 'landmark',
    description: 'Journey through time with questions about historical events and figures',
    questionCount: 100,
    color: '#FF003D'
  },
  {
    id: '4',
    name: 'Geography',
    icon: 'globe',
    description: 'Explore the world with questions about countries, capitals, and landmarks',
    questionCount: 80,
    color: '#00B4D8'
  },
  {
    id: '5',
    name: 'Sports',
    icon: 'trophy',
    description: 'Athletic achievements, sports rules, and famous competitions',
    questionCount: 95,
    color: '#FFC400'
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Which planet is known as the Red Planet?',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'Science & Tech',
    options: [
      { id: 'a', text: 'Venus', isCorrect: false },
      { id: 'b', text: 'Mars', isCorrect: true },
      { id: 'c', text: 'Jupiter', isCorrect: false },
      { id: 'd', text: 'Saturn', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'Mars is called the Red Planet because of the reddish iron oxide on its surface.',
    timeLimit: 15,
    points: 100
  },
  {
    id: 'q2',
    text: 'Who directed the movie "Inception"?',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'Pop Culture',
    options: [
      { id: 'a', text: 'Christopher Nolan', isCorrect: true },
      { id: 'b', text: 'Steven Spielberg', isCorrect: false },
      { id: 'c', text: 'James Cameron', isCorrect: false },
      { id: 'd', text: 'Quentin Tarantino', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'Christopher Nolan directed Inception, which was released in 2010.',
    timeLimit: 15,
    points: 150
  },
  {
    id: 'q3',
    text: 'The concept of gravity was discovered by which famous physicist?',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'Science & Tech',
    options: [
      { id: 'a', text: 'Albert Einstein', isCorrect: false },
      { id: 'b', text: 'Galileo Galilei', isCorrect: false },
      { id: 'c', text: 'Isaac Newton', isCorrect: true },
      { id: 'd', text: 'Nikola Tesla', isCorrect: false }
    ],
    correctAnswer: 'c',
    explanation: 'Sir Isaac Newton formulated the theory of gravity after reportedly observing an apple falling from a tree.',
    timeLimit: 15,
    points: 150
  },
  {
    id: 'q4',
    text: 'In which year did World War II end?',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'History',
    options: [
      { id: 'a', text: '1943', isCorrect: false },
      { id: 'b', text: '1945', isCorrect: true },
      { id: 'c', text: '1947', isCorrect: false },
      { id: 'd', text: '1950', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'World War II ended in 1945 with the surrender of Germany in May and Japan in September.',
    timeLimit: 15,
    points: 150
  },
  {
    id: 'q5',
    text: 'The Great Barrier Reef is located off the coast of which country?',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'Geography',
    options: [
      { id: 'a', text: 'Brazil', isCorrect: false },
      { id: 'b', text: 'Australia', isCorrect: true },
      { id: 'c', text: 'Thailand', isCorrect: false },
      { id: 'd', text: 'Mexico', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'The Great Barrier Reef is located in the Coral Sea, off the coast of Queensland, Australia.',
    timeLimit: 15,
    points: 100
  },
  {
    id: 'q6',
    text: 'Which team won the FIFA World Cup in 2018?',
    type: 'multiple-choice',
    difficulty: 'medium',
    category: 'Sports',
    options: [
      { id: 'a', text: 'Brazil', isCorrect: false },
      { id: 'b', text: 'Germany', isCorrect: false },
      { id: 'c', text: 'France', isCorrect: true },
      { id: 'd', text: 'Argentina', isCorrect: false }
    ],
    correctAnswer: 'c',
    explanation: 'France won the 2018 FIFA World Cup, defeating Croatia 4-2 in the final match.',
    timeLimit: 15,
    points: 150
  },
  {
    id: 'q7',
    text: 'HTML is a programming language.',
    type: 'true-false',
    difficulty: 'easy',
    category: 'Science & Tech',
    options: [
      { id: 'a', text: 'True', isCorrect: false },
      { id: 'b', text: 'False', isCorrect: true }
    ],
    correctAnswer: 'b',
    explanation: 'HTML is not a programming language; it is a markup language used for creating web pages.',
    timeLimit: 10,
    points: 100
  },
  {
    id: 'q8',
    text: 'Complete the sentence: "To be, or not to be, that is the ___."',
    type: 'fill-in-blank',
    difficulty: 'medium',
    category: 'Pop Culture',
    options: [
      { id: 'a', text: 'question', isCorrect: true },
      { id: 'b', text: 'answer', isCorrect: false },
      { id: 'c', text: 'problem', isCorrect: false },
      { id: 'd', text: 'solution', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'The complete quote from Shakespeare\'s Hamlet is "To be, or not to be, that is the question."',
    timeLimit: 15,
    points: 150
  },
  {
    id: 'q9',
    text: 'Who painted the Mona Lisa?',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'Pop Culture',
    options: [
      { id: 'a', text: 'Vincent van Gogh', isCorrect: false },
      { id: 'b', text: 'Pablo Picasso', isCorrect: false },
      { id: 'c', text: 'Leonardo da Vinci', isCorrect: true },
      { id: 'd', text: 'Michelangelo', isCorrect: false }
    ],
    correctAnswer: 'c',
    explanation: 'The Mona Lisa was painted by Leonardo da Vinci, an Italian Renaissance artist, between 1503 and 1506.',
    timeLimit: 15,
    points: 100
  },
  {
    id: 'q10',
    text: 'What is the capital of Japan?',
    type: 'multiple-choice',
    difficulty: 'easy',
    category: 'Geography',
    options: [
      { id: 'a', text: 'Seoul', isCorrect: false },
      { id: 'b', text: 'Beijing', isCorrect: false },
      { id: 'c', text: 'Tokyo', isCorrect: true },
      { id: 'd', text: 'Bangkok', isCorrect: false }
    ],
    correctAnswer: 'c',
    explanation: 'Tokyo is the capital and largest city of Japan.',
    timeLimit: 15,
    points: 100
  }
];

export const mockUser: UserProfile = {
  id: 'u1',
  username: 'CyberQuizMaster',
  email: 'user@example.com',
  avatar: '/avatars/avatar1.png',
  level: 12,
  xp: 4500,
  totalQuizzes: 37,
  totalPoints: 15750,
  bestScore: 950,
  averageAccuracy: 78.5,
  powerUps: {
    'fifty-fifty': 3,
    'time-freeze': 2,
    'double-down': 1,
    'hint': 5,
    'skip': 2,
    'time-steal': 1
  },
  titles: ['Knowledge Seeker', 'Quick Thinker'],
  badges: ['5-day-streak', 'perfect-score', 'first-win'],
  friends: ['u2', 'u3', 'u4'],
  createdAt: '2023-05-15T10:00:00Z',
  lastActive: '2023-07-21T18:30:00Z',
  preferences: {
    theme: 'dark',
    soundEffects: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    hapticFeedback: true,
    motionReduction: false,
    colorblindMode: false
  }
};

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: 'u5',
    username: 'BrainiacSupreme',
    avatar: '/avatars/avatar5.png',
    level: 28,
    score: 24680,
    position: 1,
    change: 0
  },
  {
    userId: 'u8',
    username: 'TriviaKing',
    avatar: '/avatars/avatar8.png',
    level: 25,
    score: 22340,
    position: 2,
    change: 1
  },
  {
    userId: 'u12',
    username: 'QuizWizard',
    avatar: '/avatars/avatar12.png',
    level: 23,
    score: 19870,
    position: 3,
    change: -1
  },
  {
    userId: 'u1',
    username: 'CyberQuizMaster',
    avatar: '/avatars/avatar1.png',
    level: 12,
    score: 15750,
    position: 4,
    change: 2
  },
  {
    userId: 'u7',
    username: 'KnowledgeHunter',
    avatar: '/avatars/avatar7.png',
    level: 15,
    score: 14950,
    position: 5,
    change: -1
  },
  {
    userId: 'u3',
    username: 'FactFinder',
    avatar: '/avatars/avatar3.png',
    level: 10,
    score: 10200,
    position: 6,
    change: 0
  },
  {
    userId: 'u9',
    username: 'CuriousMind',
    avatar: '/avatars/avatar9.png',
    level: 8,
    score: 7850,
    position: 7,
    change: 3
  }
];
