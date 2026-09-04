import React from 'react';
import { CinematicAVFlame } from './CinematicAVFlame';

/**
 * GlobalCinematicBackground
 * 
 * Renders the official AV (Auric Vista / Auric Arohi) luxury gold emblem as a FIXED,
 * viewport-centered, non-scrolling global background behind all website content.
 * 
 * Features:
 * - Fixed to viewport (does not scroll with page content)
 * - Proportions perfectly preserved (aspect-[404/456], object-contain)
 * - Deep metallic gold edges with 4K clarity
 * - Procedural flowing liquid gold + soft white flame effect flowing through the letter strokes
 * - Bright white-hot highlights and organic, elegant flame motion
 * - Masked 100% strictly to the AV contours so flames never bleed outside
 * - Surrounding background remains deep black/charcoal with subtle heat radiance
 * - Periodic smooth specular shimmer gliding along the curves
 * - Zero click/scroll interference (pointer-events: none, select-none)
 */
export const GlobalCinematicBackground: React.FC = () => {
  return (
    <div
      id="auric-arohi-global-fixed-bg"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      {/* 1. Deepest Background: Darkest Pure Charcoal/Black Ambient Canvas */}
      <div className="absolute inset-0 bg-[#030303] -z-30" />

      {/* 2. Ambient Vignette Radial Falloff (Deep pure dark at edges, subtle warm glow at center) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,18,11,0.55)_0%,rgba(6,5,4,0.92)_55%,#020202_100%)] -z-20" />

      {/* 3. Soft Breathing Golden Heat Aura behind the AV Emblem */}
      <div className="absolute w-[60vw] max-w-[420px] aspect-[404/456] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.22)_0%,rgba(180,135,15,0.08)_45%,transparent_70%)] animate-av-halo-breathe blur-3xl pointer-events-none -z-10" />

      {/* 4. Centered Proportional AV Emblem Container (Living Gold + White Flame) */}
      <div className="relative w-[52vw] max-w-[190px] sm:max-w-[240px] md:max-w-[290px] lg:max-w-[330px] xl:max-w-[360px] aspect-[404/456] opacity-[0.88] sm:opacity-[0.92] transition-opacity duration-700">
        
        {/* Layer A: Base AV Emblem Image (Provides deep metallic gold edges, bevels, 3D grain) */}
        <img
          src="/assets/brand/av-emblem-transparent.png"
          alt=""
          className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(250,230,158,0.7)] drop-shadow-[0_0_40px_rgba(212,175,55,0.45)] brightness-105 contrast-115"
          loading="eager"
          decoding="async"
        />

        {/* Layer B: Procedural Gold + Soft White Liquid Flame (Masked 100% inside the AV letter contours) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            WebkitMaskImage: 'url(/assets/brand/av-emblem-transparent.png)',
            maskImage: 'url(/assets/brand/av-emblem-transparent.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            mixBlendMode: 'screen',
          }}
        >
          <CinematicAVFlame className="opacity-80" />
        </div>

        {/* Layer C: White-Hot Core Highlights (Color-Dodge for luminous fiery heat) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            WebkitMaskImage: 'url(/assets/brand/av-emblem-transparent.png)',
            maskImage: 'url(/assets/brand/av-emblem-transparent.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            mixBlendMode: 'color-dodge',
          }}
        >
          <CinematicAVFlame className="opacity-40 filter brightness-125" />
        </div>

        {/* Layer D: Travelling Metallic Specular Shimmer (Soft periodic glint following curves) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            WebkitMaskImage: 'url(/assets/brand/av-emblem-transparent.png)',
            maskImage: 'url(/assets/brand/av-emblem-transparent.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        >
          {/* Animated light beam reflecting across polished gold */}
          <div className="absolute inset-0 w-full h-full animate-av-metallic-shine" />
        </div>
      </div>
    </div>
  );
};
