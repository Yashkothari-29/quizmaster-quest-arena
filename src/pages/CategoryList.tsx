
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/mockData';
import { Category } from '@/types/quiz';
import { motion } from 'framer-motion';
import { Play, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

const CategoryList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold neon-text mb-4"
          >
            Quiz Categories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-foreground/70"
          >
            Choose a category to start your quiz adventure
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="relative max-w-md mx-auto mb-12"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 cyber-box border-quiz-purple/30 bg-quiz-dark/30"
          />
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCategories.map((category: Category) => (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div 
                className="cyber-box h-full flex flex-col p-6"
                style={{ borderColor: `${category.color}30` }}
              >
                <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                  <span className="text-2xl" style={{ color: category.color }}>
                    {category.icon === 'flask' && '🧪'}
                    {category.icon === 'film' && '🎬'}
                    {category.icon === 'landmark' && '🏛️'}
                    {category.icon === 'globe' && '🌍'}
                    {category.icon === 'trophy' && '🏆'}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: category.color }}>{category.name}</h3>
                <p className="text-foreground/70 flex-grow mb-4">{category.description}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-foreground/60">{category.questionCount} questions</span>
                    <span className="text-sm px-2 py-1 rounded-full bg-quiz-dark/70" style={{ color: category.color }}>
                      {category.questionCount > 120 ? 'Expert' : category.questionCount > 90 ? 'Advanced' : 'Beginner'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="border-quiz-purple/50 text-quiz-purple hover:bg-quiz-purple/20"
                      asChild
                    >
                      <Link to={`/category/${category.id}`}>View</Link>
                    </Button>
                    <Button 
                      className="bg-quiz-purple hover:bg-quiz-purple/80"
                      asChild
                    >
                      <Link to={`/quiz/${category.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Play
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-foreground/70">No categories found matching "{searchTerm}"</p>
            <Button 
              className="mt-4 bg-quiz-purple hover:bg-quiz-purple/80"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryList;
