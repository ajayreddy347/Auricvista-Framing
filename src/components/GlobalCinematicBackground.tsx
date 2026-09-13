import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * GlobalCinematicBackground
 * 
 * Premium Agricultural Atmosphere Background System for Auric Arohi:
 * - 100% free of large logos, AV watermarks, or distracting flame animations.
 * - Subtly blends rich dark charcoal, warm loam soil undertones, and dawn-horizon golden glow.
 * - Supports Dark and Light themes natively with soft agrarian topography textures.
 * - Ensures product cards, listings, and text remain crisp and 100% readable.
 */
export const GlobalCinematicBackground: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      id="auric-arohi-global-fixed-bg"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {isDark ? (
        /* ================= DARK MODE AGRICULTURAL CANVAS ================= */
        <div className="absolute inset-0 transition-opacity duration-700">
          {/* 1. Deepest Base Canvas: Warm Dark Charcoal / Rich Loam Soil Tone */}
          <div className="absolute inset-0 bg-[#080706]" />

          {/* 2. Subtle Natural Soil & Forest Depth (Earth tones, not flat black) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(38,28,16,0.5)_0%,rgba(16,20,15,0.3)_45%,transparent_80%)]" />

          {/* 3. Soft Horizon Dawn Glow (Faint golden-hour light filtering down from top) */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,rgba(180,135,15,0.02)_50%,transparent_75%)] blur-3xl pointer-events-none" />

          {/* 4. Very Subtle Agrarian Contour Pattern (Terraced Farm Field Lines) */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px),
                                linear-gradient(0deg, transparent 95%, rgba(212, 175, 55, 0.2) 100%)`,
              backgroundSize: '48px 48px, 100% 72px',
            }}
          />

          {/* 5. Edge Vignette (Keeps focus crisp on content) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,5,4,0.6)_100%)]" />
        </div>
      ) : (
        /* ================= LIGHT MODE AGRICULTURAL CANVAS ================= */
        <div className="absolute inset-0 transition-opacity duration-700">
          {/* 1. Base Canvas: Clean Premium White / Very Light Warm-White */}
          <div className="absolute inset-0 bg-[#ffffff]" />

          {/* 2. Soft Sunlit Earth Undertone (Warm cream & golden grain) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_0%,rgba(253,250,245,0.95)_0%,rgba(250,248,243,0.7)_50%,#ffffff_100%)]" />

          {/* 3. Morning Sun Flare Glow */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,rgba(245,158,11,0.02)_50%,transparent_75%)] blur-3xl pointer-events-none" />

          {/* 4. Very Subtle Light Organic Grid */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(184, 134, 11, 0.12) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(184, 134, 11, 0.12) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />

          {/* 5. Clean Edge Falloff */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(245,242,236,0.3)_100%)]" />
        </div>
      )}
    </div>
  );
};
