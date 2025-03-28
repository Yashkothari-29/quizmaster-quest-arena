
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { 
  User, 
  LogOut, 
  Trophy, 
  Menu, 
  Settings, 
  Home, 
  Gamepad 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-quiz-purple/30 bg-background/90 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold neon-text">
            QuizQuest<span className="neon-text-teal">Arena</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-quiz-purple transition-colors">
            Home
          </Link>
          <Link to="/categories" className="text-foreground hover:text-quiz-purple transition-colors">
            Categories
          </Link>
          <Link to="/battle" className="text-foreground hover:text-quiz-purple transition-colors">
            Battle
          </Link>
          <Link to="/leaderboard" className="text-foreground hover:text-quiz-purple transition-colors">
            Leaderboard
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-quiz-purple neon-border">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback className="bg-quiz-dark text-quiz-purple">
                      {user?.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 cyber-box" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">Level {user?.level}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/leaderboard'}>
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Leaderboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" className="bg-quiz-purple hover:bg-quiz-purple/80" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="cyber-box w-56 md:hidden">
              <DropdownMenuItem onClick={() => window.location.href = '/'}>
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/categories'}>
                <Gamepad className="mr-2 h-4 w-4" />
                <span>Categories</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/battle'}>
                <User className="mr-2 h-4 w-4" />
                <span>Battle</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/leaderboard'}>
                <Trophy className="mr-2 h-4 w-4" />
                <span>Leaderboard</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
