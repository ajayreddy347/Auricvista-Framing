import React from 'react';
import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { FeaturedProduceSection } from '../components/FeaturedProduceSection';
import { MeetTheFarmer } from '../components/MeetTheFarmer';
import { GoogleFarmMap } from '../components/GoogleFarmMap';
import { HowItWorks } from '../components/HowItWorks';
import { SmartCartHomeSection } from '../components/SmartCartHomeSection';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

/**
 * HomePage
 * 
 * Implements a clean, cohesive user journey:
 * 1. Discover        -> Hero (Fresh Indian Harvests. Direct From Farmers.)
 * 2. Explore Produce -> FeaturedProduceSection (Dawn harvests, verified produce cards)
 * 3. Meet Farmers    -> MeetTheFarmer + Pan-India Agricultural Network Map
 * 4. Smart Shopping  -> HowItWorks (Farm-to-Doorstep Flow) + SmartCartHomeSection
 * 5. Order           -> FinalCTA (Start fresh farm journey)
 * 6. Footer          -> 4-column structured footer
 */
export const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-transparent text-[#fcfbf7] flex flex-col"
    >
      {/* 1. DISCOVER — CINEMATIC HERO */}
      <Hero />

      {/* 2. EXPLORE PRODUCE — FEATURED HARVESTS */}
      <FeaturedProduceSection />

      {/* 3. MEET FARMERS — VERIFIED GROWER NETWORK + ORIGIN MAP */}
      <section id="meet-farmers-home" className="relative scroll-mt-20">
        <MeetTheFarmer />
        <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0c120d]/80 via-[#10140e]/75 to-[#14120c]/80 backdrop-blur-[2px] border-t border-[#d4af37]/15">
          <div className="max-w-7xl mx-auto w-full">
            <GoogleFarmMap />
          </div>
        </div>
      </section>

      {/* 4. SMART SHOPPING — HOW IT WORKS & SMART CART ROUTINES */}
      <section id="smart-shopping-flow" className="relative">
        <HowItWorks />
        <SmartCartHomeSection />
      </section>

      {/* 5. ORDER — FINAL CALL TO ACTION */}
      <FinalCTA />

      {/* 6. FOOTER */}
      <Footer />
    </motion.div>
  );
};
