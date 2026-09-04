import React from 'react';
import { motion } from 'motion/react';
import { CommunityImpact } from '../components/CommunityImpact';
import { SurplusProduce } from '../components/SurplusProduce';
import { Footer } from '../components/Footer';

export const ImpactPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-transparent text-[#fcfbf7] pt-20"
    >
      <CommunityImpact />
      <SurplusProduce />
      <Footer />
    </motion.div>
  );
};
