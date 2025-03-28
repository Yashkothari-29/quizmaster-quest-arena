
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { mockLeaderboard } from '@/data/mockData';
import { LeaderboardEntry } from '@/types/quiz';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardType, setLeaderboardType] = useState('global');
  
  const getLeaderboardData = () => {
    switch (leaderboardType) {
      case 'global':
        return mockLeaderboard;
      case 'daily':
        // Simulate daily leaderboard with shuffled positions
        return [...mockLeaderboard]
          .sort(() => 0.5 - Math.random())
          .map((entry, index) => ({
            ...entry,
            position: index + 1,
            change: Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)
          }));
      case 'weekly':
        // Simulate weekly leaderboard with different positions
        return [...mockLeaderboard]
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((entry, index) => ({
            ...entry,
            position: index + 1,
            change: Math.floor(Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1)
          }));
      case 'friends':
        // Filter for friends only (mock)
        return mockLeaderboard
          .filter(entry => (user?.friends || []).includes(entry.userId) || entry.userId === user?.id)
          .map((entry, index) => ({
            ...entry,
            position: index + 1,
            change: Math.floor(Math.random() * 2)
          }));
      default:
        return mockLeaderboard;
    }
  };
  
  const leaderboardData = getLeaderboardData();
  
  const getPositionStyles = (position: number) => {
    switch (position) {
      case 1:
        return "border-yellow-500 text-yellow-500 bg-yellow-500/10";
      case 2:
        return "border-gray-400 text-gray-400 bg-gray-400/10";
      case 3:
        return "border-amber-700 text-amber-700 bg-amber-700/10";
      default:
        return "border-quiz-purple text-quiz-purple bg-quiz-purple/10";
    }
  };
  
  const getUserRank = () => {
    if (!user) return null;
    
    const userEntry = leaderboardData.find(entry => entry.userId === user.id);
    if (!userEntry) return null;
    
    return (
      <div className="mt-8 p-4 cyber-box-teal">
        <h3 className="text-lg font-bold mb-4 text-quiz-teal">Your Ranking</h3>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mr-4 ${getPositionStyles(userEntry.position)}`}>
            {userEntry.position}
          </div>
          
          <Avatar className="h-10 w-10 border-2 border-quiz-teal mr-4">
            <AvatarImage src={userEntry.avatar} alt={userEntry.username} />
            <AvatarFallback className="bg-quiz-dark">
              {userEntry.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-grow">
            <p className="font-bold">{userEntry.username}</p>
            <p className="text-sm text-foreground/70">Level {userEntry.level}</p>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-quiz-teal">{userEntry.score.toLocaleString()}</p>
            <div className="flex items-center justify-end">
              {userEntry.change > 0 ? (
                <div className="flex items-center text-green-500 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  <span>+{userEntry.change}</span>
                </div>
              ) : userEntry.change < 0 ? (
                <div className="flex items-center text-red-500 text-sm">
                  <TrendingDown className="h-3 w-3 mr-1" /> 
                  <span>{userEntry.change}</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500 text-sm">
                  <Minus className="h-3 w-3 mr-1" /> 
                  <span>0</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-3 rounded-full bg-quiz-purple/20 mb-4"
          >
            <Trophy className="h-10 w-10 text-quiz-purple" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold neon-text mb-2"
          >
            Leaderboard
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-foreground/70"
          >
            Compete with players around the world
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="global" onValueChange={setLeaderboardType} className="mb-8">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="friends" disabled={!user}>Friends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="mt-6">
              <LeaderboardTable data={leaderboardData} />
            </TabsContent>
            
            <TabsContent value="daily" className="mt-6">
              <LeaderboardTable data={leaderboardData} />
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-6">
              <LeaderboardTable data={leaderboardData} />
            </TabsContent>
            
            <TabsContent value="friends" className="mt-6">
              {user ? (
                <LeaderboardTable data={leaderboardData} />
              ) : (
                <div className="text-center py-12 cyber-box">
                  <p className="text-lg mb-4">Sign in to see your friends' rankings</p>
                  <Button className="bg-quiz-purple hover:bg-quiz-purple/80">Sign In</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {user && getUserRank()}
        </div>
      </div>
    </Layout>
  );
};

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  const { user } = useAuth();
  
  const getPositionStyles = (position: number) => {
    switch (position) {
      case 1:
        return "border-yellow-500 text-yellow-500 bg-yellow-500/10";
      case 2:
        return "border-gray-400 text-gray-400 bg-gray-400/10";
      case 3:
        return "border-amber-700 text-amber-700 bg-amber-700/10";
      default:
        return "border-quiz-purple text-quiz-purple bg-quiz-purple/10";
    }
  };
  
  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {data.map((entry) => (
        <motion.div
          key={entry.userId}
          variants={itemVariants}
          className={`p-4 rounded-lg flex items-center ${
            isCurrentUser(entry.userId) 
              ? 'cyber-box-teal animate-pulse-glow' 
              : 'bg-quiz-dark/30'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mr-4 ${getPositionStyles(entry.position)}`}>
            {entry.position}
          </div>
          
          <Avatar className="h-10 w-10 border-2 border-white/20 mr-4">
            <AvatarImage src={entry.avatar} alt={entry.username} />
            <AvatarFallback className="bg-quiz-dark">
              {entry.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-grow">
            <p className={`font-bold ${isCurrentUser(entry.userId) ? 'text-quiz-teal' : ''}`}>
              {entry.username} {isCurrentUser(entry.userId) && '(You)'}
            </p>
            <p className="text-sm text-foreground/70">Level {entry.level}</p>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-quiz-purple">{entry.score.toLocaleString()}</p>
            <div className="flex items-center justify-end">
              {entry.change > 0 ? (
                <div className="flex items-center text-green-500 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  <span>+{entry.change}</span>
                </div>
              ) : entry.change < 0 ? (
                <div className="flex items-center text-red-500 text-sm">
                  <TrendingDown className="h-3 w-3 mr-1" /> 
                  <span>{entry.change}</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500 text-sm">
                  <Minus className="h-3 w-3 mr-1" /> 
                  <span>0</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Leaderboard;
