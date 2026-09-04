import React from 'react';
import { motion } from 'motion/react';
import { ProduceMarketplace } from '../components/ProduceMarketplace';
import { TransparentPricing } from '../components/TransparentPricing';
import { SmartCartSubscriptions } from '../components/SmartCartSubscriptions';
import { BulkBuying } from '../components/BulkBuying';
import { Footer } from '../components/Footer';

export const MarketplacePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-transparent text-[#fcfbf7] pt-20"
    >
      <ProduceMarketplace />
      <TransparentPricing />
      <SmartCartSubscriptions />
      <BulkBuying />
      <Footer />
    </motion.div>
  );
};
