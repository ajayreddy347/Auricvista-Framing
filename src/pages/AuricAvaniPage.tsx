import React from 'react';
import { motion } from 'motion/react';
import { AuricAvani } from '../components/AuricAvani';
import { Footer } from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export const AuricAvaniPage: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className={`min-h-screen bg-transparent ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}
    >
      <AuricAvani />
      <Footer />
    </motion.div>
  );
};

