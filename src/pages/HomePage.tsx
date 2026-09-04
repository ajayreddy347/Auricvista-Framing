import React from 'react';
import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { FeaturedProduceSection } from '../components/FeaturedProduceSection';
import { HowItWorks } from '../components/HowItWorks';
import { GoogleFarmMap } from '../components/GoogleFarmMap';
import { SmartCartHomeSection } from '../components/SmartCartHomeSection';
import { WhyChooseSection } from '../components/WhyChooseSection';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-transparent text-[#fcfbf7] flex flex-col"
    >
      {/* 1. SECTION 1 — CINEMATIC HERO (Farmland + Sunrise Rays) */}
      <Hero />

      {/* 2. SECTION 2 — FEATURED PRODUCE (Deep warm charcoal & dark earthy background) */}
      <FeaturedProduceSection />

      {/* 3. SECTION 3 — HOW IT WORKS (Subtle dark forest/olive gradient) */}
      <HowItWorks />

      {/* 4. SECTION 4 — EXPLORE FARMERS (Deep earth/forest tone with Pan-India Agricultural Network) */}
      <section id="explore-farmers" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0c120d]/80 via-[#10140e]/75 to-[#14120c]/80 backdrop-blur-[2px] border-t border-[#d4af37]/15">
        <div className="max-w-7xl mx-auto w-full">
          <GoogleFarmMap />
        </div>
      </section>

      {/* 5. SECTION 5 — SMART CART (Dark warm charcoal with subtle amber harvest glow) */}
      <SmartCartHomeSection />

      {/* 6. SECTION 6 — WHY AURIC AROHI (Deep muted forest green / charcoal gradient) */}
      <WhyChooseSection />

      {/* 7. SECTION 7 — FINAL CTA (Cinematic golden-hour sunset farmland) */}
      <FinalCTA />

      {/* 8. FOOTER (Warm deep charcoal) */}
      <Footer />
    </motion.div>
  );
};
