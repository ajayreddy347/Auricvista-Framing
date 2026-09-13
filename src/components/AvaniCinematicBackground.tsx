import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * AvaniCinematicBackground
 * 
 * Dedicated, independent cinematic background for the Auric Avani sister platform.
 * Supports Dark and Light themes with pure white agrarian atmosphere in Light Mode.
 */
export const AvaniCinematicBackground: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      id="auric-avani-global-fixed-bg"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      {isDark ? (
        /* ================= DARK MODE AGRICULTURAL CANVAS ================= */
        <>
          {/* 1. Base Dark Fertile Loam Canvas */}
          <div className="absolute inset-0 bg-[#050403] -z-30" />

          {/* 2. Ambient Warm Soil & Loam Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(35,21,11,0.5)_0%,rgba(14,9,4,0.85)_50%,#030202_100%)] -z-25" />

          {/* 3. Subtle Cinematic Farmland Texture (furrows, rich agricultural earth) */}
          <div className="absolute inset-0 -z-20 overflow-hidden opacity-10">
            <img
              src="/assets/backgrounds/hero_cinematic_farmland.jpg"
              alt=""
              className="w-full h-full object-cover filter brightness-75 contrast-125 mix-blend-luminosity"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#05110a]/90 via-[#0a0704]/75 to-[#040805]/95" />
          </div>

          {/* 4. Soft Breathing Emerald & Gold Bio-Aura */}
          <div className="absolute w-[75vw] max-w-[550px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,rgba(212,175,55,0.06)_40%,transparent_70%)] animate-avani-aura-pulse blur-3xl pointer-events-none -z-15" />
          <div className="absolute w-[60vw] max-w-[450px] aspect-square rounded-full bg-[radial-gradient(ellipse_at_center,rgba(180,83,9,0.08)_0%,transparent_65%)] blur-2xl pointer-events-none -z-15 translate-y-24" />
        </>
      ) : (
        /* ================= LIGHT MODE AGRICULTURAL CANVAS ================= */
        <>
          {/* 1. Base Pure White Canvas */}
          <div className="absolute inset-0 bg-[#ffffff] -z-30" />

          {/* 2. Ambient Soft Warm & Emerald Sunlit Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(240,253,244,0.65)_0%,rgba(252,250,246,0.85)_50%,#ffffff_100%)] -z-25" />

          {/* 3. Subtle Clean Farmland Texture at very low opacity */}
          <div className="absolute inset-0 -z-20 overflow-hidden opacity-[0.03]">
            <img
              src="/assets/backgrounds/hero_cinematic_farmland.jpg"
              alt=""
              className="w-full h-full object-cover filter brightness-110 contrast-100"
              loading="eager"
            />
          </div>

          {/* 4. Soft Breathing Emerald & Gold Sunlight Aura */}
          <div className="absolute w-[75vw] max-w-[550px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.07)_0%,rgba(212,175,55,0.04)_40%,transparent_70%)] animate-avani-aura-pulse blur-3xl pointer-events-none -z-15" />
          <div className="absolute w-[60vw] max-w-[450px] aspect-square rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.03)_0%,transparent_65%)] blur-2xl pointer-events-none -z-15 translate-y-24" />
        </>
      )}

      {/* 5. Centerpiece: Auric Avani "Circle of Life" Botanical Watermark (Organic Sprout & Regenerative Ring) */}
      <div className="relative w-[65vw] max-w-[420px] aspect-square flex items-center justify-center pointer-events-none select-none opacity-15">
        {/* Outer Orbital Rotating Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#10b981]/30 animate-avani-slow-spin" />
        <div className="absolute inset-6 rounded-full border border-[#d4af37]/25" />

        {/* Central Organic Seedling & Earth Crest */}
        <svg
          viewBox="0 0 120 120"
          className="w-48 h-48 text-[#10b981]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Orbit Arrows */}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="6 4"
            className="text-[#34d399]/40"
          />
          {/* Soil Base / Furrow Curves */}
          <path
            d="M24 88C35 80 47 80 60 84C73 88 85 86 96 80"
            stroke="#d4af37"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-70"
          />
          <path
            d="M30 96C40 90 50 90 60 93C70 96 80 94 90 90"
            stroke="#b45309"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="opacity-60"
          />
          {/* Sprouting Stems & Leaves */}
          <path
            d="M60 84V44"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Left Leaf */}
          <path
            d="M60 58C48 56 40 44 42 34C52 34 60 44 60 58Z"
            fill="url(#avani-leaf-grad-left)"
            stroke="#34d399"
            strokeWidth="1.2"
          />
          {/* Right Leaf */}
          <path
            d="M60 50C72 48 80 36 78 26C68 26 60 36 60 50Z"
            fill="url(#avani-leaf-grad-right)"
            stroke="#fae69e"
            strokeWidth="1.2"
          />
          {/* Seed Gem at Root */}
          <circle cx="60" cy="84" r="3.5" fill="#fae69e" />

          {/* Gradients */}
          <defs>
            <linearGradient id="avani-leaf-grad-left" x1="42" y1="34" x2="60" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="1" stopColor="#064e3b" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="avani-leaf-grad-right" x1="78" y1="26" x2="60" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fae69e" stopOpacity="0.8" />
              <stop offset="1" stopColor="#d4af37" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 6. Floating Organic Micro-Particles & Leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Particle 1: Golden Spore */}
        <div
          className="absolute left-[15%] w-2 h-2 rounded-full bg-[#fae69e]/40 blur-[1px] animate-avani-drift-1"
          style={{ bottom: '-5%' }}
        />
        {/* Particle 2: Emerald Micro-Leaf */}
        <div
          className="absolute left-[35%] w-2.5 h-1.5 rounded-full bg-[#34d399]/35 rotate-45 animate-avani-drift-2"
          style={{ bottom: '-5%' }}
        />
        {/* Particle 3: Warm Loam Fleck */}
        <div
          className="absolute left-[65%] w-2 h-2 rounded-full bg-[#d4af37]/35 blur-[1px] animate-avani-drift-3"
          style={{ bottom: '-5%' }}
        />
        {/* Particle 4: Emerald Seed */}
        <div
          className="absolute left-[82%] w-2.5 h-1.5 rounded-full bg-[#10b981]/40 -rotate-45 animate-avani-drift-4"
          style={{ bottom: '-5%' }}
        />
      </div>
    </div>
  );
};

export default AvaniCinematicBackground;
