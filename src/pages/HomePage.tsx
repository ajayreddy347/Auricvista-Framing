import React from 'react';
import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { TheProblem } from '../components/TheProblem';
import { HowItWorks } from '../components/HowItWorks';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[#070707] text-[#fcfbf7]"
    >
      <Hero />
      <TheProblem />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </motion.div>
  );
};
