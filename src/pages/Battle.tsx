
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Gamepad, Share2, Copy, Users, Zap, Star } from 'lucide-react';

const Battle = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [battleCode, setBattleCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  
  const handleCreateBattle = () => {
    // Generate a random battle code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    
    toast({
      title: "Battle Created!",
      description: "Share this code with your friends to challenge them.",
    });
  };
  
  const handleJoinBattle = () => {
    if (!battleCode) {
      toast({
        title: "Error",
        description: "Please enter a battle code.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Joining Battle",
      description: `Attempting to join battle with code: ${battleCode}`,
    });
    
    // In a real app, this would verify the code and connect to the battle
    // For now, simulate success
    setTimeout(() => {
      toast({
        title: "Battle Joined!",
        description: "Prepare for the challenge.",
      });
    }, 1000);
  };
  
  const copyToClipboard = () => {
    if (!generatedCode) return;
    
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Battle code copied to clipboard.",
    });
  };

  return (
    <Layout>
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-3 rounded-full bg-quiz-purple/20 mb-4"
          >
            <Gamepad className="h-10 w-10 text-quiz-purple" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold neon-text mb-2"
          >
            Battle Arena
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-foreground/70 max-w-2xl mx-auto"
          >
            Challenge your friends in real-time quiz battles and see who reigns supreme in the QuizQuest Arena!
          </motion.p>
        </div>
        
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto cyber-box text-center"
          >
            <h2 className="text-2xl font-bold mb-4 neon-text">Sign In to Battle</h2>
            <p className="mb-6 text-foreground/70">
              You need to be signed in to create or join battles.
            </p>
            <Button className="bg-quiz-purple hover:bg-quiz-purple/80" asChild>
              <a href="/login">Sign In</a>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="cyber-box"
            >
              <h2 className="text-2xl font-bold mb-4 neon-text">Create Battle</h2>
              <p className="mb-6 text-foreground/70">
                Start a new battle and invite your friends to join. You'll be the quiz master!
              </p>
              
              {generatedCode ? (
                <div className="space-y-4">
                  <div className="p-4 bg-quiz-dark/50 rounded-lg text-center">
                    <p className="text-sm text-foreground/70 mb-2">Share this code</p>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-mono font-bold tracking-widest text-quiz-teal">
                        {generatedCode}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-2" 
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Button className="bg-quiz-teal hover:bg-quiz-teal/80 text-black">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Battle Link
                    </Button>
                    <Button variant="outline">
                      <Zap className="mr-2 h-4 w-4" />
                      Start Battle
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full bg-quiz-purple hover:bg-quiz-purple/80"
                  onClick={handleCreateBattle}
                >
                  <Gamepad className="mr-2 h-5 w-5" />
                  Create New Battle
                </Button>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="cyber-box"
            >
              <h2 className="text-2xl font-bold mb-4 neon-text-teal">Join Battle</h2>
              <p className="mb-6 text-foreground/70">
                Enter a battle code to join an existing quiz battle.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="battleCode" className="block text-sm text-foreground/70 mb-2">
                    Battle Code
                  </label>
                  <Input
                    id="battleCode"
                    placeholder="Enter 6-digit code"
                    value={battleCode}
                    onChange={(e) => setBattleCode(e.target.value.toUpperCase())}
                    className="font-mono text-center uppercase tracking-widest bg-quiz-dark/50 border-quiz-teal/30"
                    maxLength={6}
                  />
                </div>
                
                <Button 
                  className="w-full bg-quiz-teal hover:bg-quiz-teal/80 text-black"
                  onClick={handleJoinBattle}
                  disabled={!battleCode}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join Battle
                </Button>
              </div>
            </motion.div>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center neon-text">Battle Modes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="cyber-box-teal relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-quiz-teal/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="p-2 mb-4 bg-quiz-teal/20 rounded-full w-14 h-14 flex items-center justify-center">
                <Users className="h-7 w-7 text-quiz-teal" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-quiz-teal">1v1 Duel</h3>
              <p className="text-foreground/70 mb-4">
                Go head-to-head with a friend in a fast-paced quiz battle.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-quiz-teal mr-2" />
                  <span>10 questions per player</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-quiz-teal mr-2" />
                  <span>Live opponent progress</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-quiz-teal mr-2" />
                  <span>Timed responses</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-quiz-teal text-quiz-teal hover:bg-quiz-teal/10">
                Play 1v1
              </Button>
            </div>
            
            <div className="cyber-box relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-quiz-purple/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="p-2 mb-4 bg-quiz-purple/20 rounded-full w-14 h-14 flex items-center justify-center">
                <Users className="h-7 w-7 text-quiz-purple" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-quiz-purple">Battle Royale</h3>
              <p className="text-foreground/70 mb-4">
                Compete against up to 50 players in a thrilling elimination contest.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-quiz-purple mr-2" />
                  <span>Last player standing wins</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-quiz-purple mr-2" />
                  <span>Increasing difficulty</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-quiz-purple mr-2" />
                  <span>Live leaderboard</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-quiz-purple text-quiz-purple hover:bg-quiz-purple/10">
                Play Battle Royale
              </Button>
            </div>
            
            <div className="cyber-box-teal relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-yellow-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="p-2 mb-4 bg-yellow-500/20 rounded-full w-14 h-14 flex items-center justify-center">
                <Users className="h-7 w-7 text-yellow-500" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-yellow-500">Team Battle</h3>
              <p className="text-foreground/70 mb-4">
                Form teams and collaborate to outscore your opponents.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>2-5 players per team</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>Collaborative answers</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>Team power-ups</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
                Play Team Battle
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Battle;
