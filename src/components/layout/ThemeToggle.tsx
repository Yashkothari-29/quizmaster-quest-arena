
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUserPreferences } = useAuth();

  const handleToggle = () => {
    toggleTheme();
    if (user) {
      updateUserPreferences({ theme: theme === 'dark' ? 'light' : 'dark' });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleToggle}
      className="rounded-full w-10 h-10 hover:bg-quiz-purple/20"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-quiz-teal" />
      ) : (
        <Moon className="h-5 w-5 text-quiz-purple" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
