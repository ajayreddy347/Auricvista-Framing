import React from 'react';
import { motion } from 'motion/react';
import { HowItWorks } from '../components/HowItWorks';
import { AIAssistant } from '../components/AIAssistant';
import { FarmsNearYou } from '../components/FarmsNearYou';
import { Footer } from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export const HowItWorksPage: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className={`min-h-screen ${isDark ? 'bg-transparent text-[#fcfbf7]' : 'bg-[#faf8f5] text-[#1c1917]'} pt-20 transition-colors duration-300`}
    >
      <HowItWorks className="pt-8 sm:pt-12 pb-16" />
      <AIAssistant />
      <FarmsNearYou />
      <Footer />
    </motion.div>
  );
};

