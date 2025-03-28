
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Gamepad, Trophy, Play, UserPlus } from 'lucide-react';
import { categories } from '@/data/mockData';
import { Category } from '@/types/quiz';
import ConfettiEffect from '@/components/ui/confetti-effect';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <Layout>
      <ConfettiEffect active={showConfetti} />
      
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none"></div>
        <div className="absolute inset-0 bg-cyber-glow pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  <span className="block neon-text">QuizQuest</span>
                  <span className="block neon-text-teal">Arena</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto lg:mx-0 text-xl text-foreground/80 sm:text-2xl">
                  Test your knowledge, challenge friends, and climb the global leaderboards in the ultimate quiz experience.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button 
                    size="lg" 
                    className="bg-quiz-purple hover:bg-quiz-purple/80 neon-border"
                    asChild
                  >
                    <Link to="/categories">
                      <Gamepad className="mr-2 h-5 w-5" />
                      Play Now
                    </Link>
                  </Button>
                  
                  {!isAuthenticated ? (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-quiz-teal text-quiz-teal hover:bg-quiz-teal/10 neon-border-teal"
                      asChild
                    >
                      <Link to="/register">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Sign Up
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-quiz-teal text-quiz-teal hover:bg-quiz-teal/10 neon-border-teal"
                      asChild
                    >
                      <Link to="/battle">
                        <Trophy className="mr-2 h-5 w-5" />
                        Challenge
                      </Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="cyber-box p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-quiz-purple/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-quiz-teal/20 rounded-tr-full"></div>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4 neon-text">Quick Stats</h2>
                  {isAuthenticated && user ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-quiz-dark/80 p-4 rounded-lg">
                          <p className="text-muted-foreground text-sm">Level</p>
                          <p className="text-2xl font-bold text-quiz-purple">{user.level}</p>
                        </div>
                        <div className="bg-quiz-dark/80 p-4 rounded-lg">
                          <p className="text-muted-foreground text-sm">XP</p>
                          <p className="text-2xl font-bold text-quiz-teal">{user.xp}</p>
                        </div>
                        <div className="bg-quiz-dark/80 p-4 rounded-lg">
                          <p className="text-muted-foreground text-sm">Quizzes</p>
                          <p className="text-2xl font-bold text-quiz-teal">{user.totalQuizzes}</p>
                        </div>
                        <div className="bg-quiz-dark/80 p-4 rounded-lg">
                          <p className="text-muted-foreground text-sm">Best Score</p>
                          <p className="text-2xl font-bold text-quiz-purple">{user.bestScore}</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-quiz-teal hover:bg-quiz-teal/80 text-black"
                        onClick={playConfetti}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Continue Playing
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-foreground/80">
                        Sign in to track your progress, earn rewards, and compete on the leaderboards!
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-quiz-dark/80 p-4 rounded-lg">
                          <p className="text-muted-foreground text-sm">Categories</p>
                          <p className="text-2xl font-bold text-quiz-purple">{categories.length}</p>
                        </div>
                        <div className="bg-quiz-dark/80 p-4 rounded-lg">
                          <p className="text-muted-foreground text-sm">Questions</p>
                          <p className="text-2xl font-bold text-quiz-teal">500+</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-quiz-purple to-quiz-teal text-white"
                        asChild
                      >
                        <Link to="/login">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-quiz-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold neon-text">Popular Categories</h2>
            <p className="mt-2 text-xl text-foreground/70">Explore our most played quiz topics</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.slice(0, 3).map((category: Category) => (
              <motion.div 
                key={category.id} 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to={`/category/${category.id}`} className="block">
                  <div 
                    className="cyber-box-teal h-full flex flex-col p-6 hover:shadow-lg transition-shadow"
                    style={{ borderColor: `${category.color}30` }}
                  >
                    <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${category.color}30` }}>
                      <span className="text-2xl" style={{ color: category.color }}>
                        {category.icon === 'flask' && '🧪'}
                        {category.icon === 'film' && '🎬'}
                        {category.icon === 'landmark' && '🏛️'}
                        {category.icon === 'globe' && '🌍'}
                        {category.icon === 'trophy' && '🏆'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: category.color }}>{category.name}</h3>
                    <p className="text-foreground/70 flex-grow">{category.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-foreground/60">{category.questionCount} questions</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-foreground hover:text-white hover:bg-quiz-purple/20"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              size="lg"
              className="border-quiz-purple text-quiz-purple hover:bg-quiz-purple/10"
              asChild
            >
              <Link to="/categories">
                View All Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-30"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold neon-text">How to Play</h2>
            <p className="mt-2 text-xl text-foreground/70">Easy steps to get started</p>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-quiz-purple/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 neon-text">Choose a Category</h3>
              <p className="text-foreground/70">Select from a wide range of quiz categories based on your interests.</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-quiz-teal/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 neon-text-teal">Answer Questions</h3>
              <p className="text-foreground/70">Race against the clock to answer questions correctly and earn points.</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-quiz-purple/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 neon-text">Climb the Ranks</h3>
              <p className="text-foreground/70">Earn XP, level up, and compete with players worldwide on our leaderboards.</p>
            </motion.div>
          </motion.div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-quiz-purple to-quiz-teal hover:opacity-90 text-white"
              asChild
            >
              <Link to={isAuthenticated ? "/categories" : "/register"}>
                {isAuthenticated ? "Start Playing" : "Join Now"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
