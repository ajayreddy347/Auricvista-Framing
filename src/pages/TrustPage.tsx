import React from 'react';
import { motion } from 'motion/react';
import { TrustVerification } from '../components/TrustVerification';
import { Footer } from '../components/Footer';

export const TrustPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[#070707] text-[#fcfbf7] pt-20"
    >
      <TrustVerification />
      <Footer />
    </motion.div>
  );
};
