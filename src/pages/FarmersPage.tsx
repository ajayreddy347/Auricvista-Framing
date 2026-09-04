import React from 'react';
import { motion } from 'motion/react';
import { MeetTheFarmer } from '../components/MeetTheFarmer';
import { Traceability } from '../components/Traceability';
import { CommunityImpact } from '../components/CommunityImpact';
import { Footer } from '../components/Footer';

export const FarmersPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-transparent text-[#fcfbf7] pt-20"
    >
      <MeetTheFarmer />
      <Traceability />
      <CommunityImpact />
      <Footer />
    </motion.div>
  );
};
