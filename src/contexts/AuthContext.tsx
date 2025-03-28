
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/quiz';
import { mockUser } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, username: string) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserProfile['preferences']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a user in localStorage
    const storedUser = localStorage.getItem('quizquest_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, we would validate credentials with API
      // For now, just simulate login with mock data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request
      setUser(mockUser);
      localStorage.setItem('quizquest_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(mockUser);
      localStorage.setItem('quizquest_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    try {
      // Create a guest user
      const guestUser: UserProfile = {
        ...mockUser,
        id: 'guest_' + Math.random().toString(36).substring(2, 9),
        username: 'Guest_' + Math.random().toString(36).substring(2, 5),
        email: '',
      };
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(guestUser);
      localStorage.setItem('quizquest_user', JSON.stringify(guestUser));
    } catch (error) {
      console.error('Guest login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizquest_user');
  };

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // In a real app, we would send registration data to API
      // For now, just simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: UserProfile = {
        ...mockUser,
        id: 'u' + Math.random().toString(36).substring(2, 9),
        username,
        email,
        level: 1,
        xp: 0,
        totalQuizzes: 0,
        totalPoints: 0,
        bestScore: 0,
        averageAccuracy: 0,
        titles: ['Newcomer'],
        badges: ['first-login'],
        friends: [],
      };

      setUser(newUser);
      localStorage.setItem('quizquest_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPreferences = (preferences: Partial<UserProfile['preferences']>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    };

    setUser(updatedUser);
    localStorage.setItem('quizquest_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        loginAsGuest,
        logout,
        register,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
