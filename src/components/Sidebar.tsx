import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Tractor,
  TrendingUp,
  HelpCircle,
  X,
  Menu,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export interface SidebarNavItem {
  id: string;
  nameKey: string;
  defaultLabel: string;
  path: string;
  icon: React.ElementType;
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    id: 'marketplace',
    nameKey: 'nav.marketplace',
    defaultLabel: 'Marketplace',
    path: '/marketplace',
    icon: ShoppingBag,
  },
  {
    id: 'farmers',
    nameKey: 'nav.farmers',
    defaultLabel: 'Farmers',
    path: '/farmers',
    icon: Tractor,
  },
  {
    id: 'impact',
    nameKey: 'nav.impact',
    defaultLabel: 'Impact',
    path: '/impact',
    icon: TrendingUp,
  },
  {
    id: 'how-it-works',
    nameKey: 'nav.howItWorks',
    defaultLabel: 'How It Works',
    path: '/how-it-works',
    icon: HelpCircle,
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobile } = useSidebar();
  const { t } = useLanguage();
  const { isDark } = useTheme();

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR (COLLAPSIBLE WITH TOP-LEFT HAMBURGER)                  */}
      {/* ========================================================================= */}
      <aside
        id="auric-desktop-sidebar"
        className={`hidden lg:flex fixed top-0 left-0 bottom-0 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        } flex-col justify-between transition-all duration-300 ease-in-out border-r shadow-2xl backdrop-blur-xl select-none ${
          isDark
            ? 'bg-[#0a0907]/95 border-[#d4af37]/25 text-[#fcfbf7]'
            : 'bg-white border-[#e7e4dc] text-[#1c1917] shadow-xl'
        }`}
      >
        <div>
          {/* Header Bar with Proper Three-Line Hamburger (☰) at Top-Left */}
          <div
            className={`h-20 flex items-center border-b transition-all duration-300 ${
              isCollapsed ? 'justify-center px-2' : 'justify-between px-4 sm:px-5'
            } ${isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'}`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="sidebar-hamburger-toggle-btn"
                onClick={toggleCollapse}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isCollapsed ? 'Expand sidebar (☰)' : 'Collapse sidebar (☰)'}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isDark
                    ? 'bg-[#14120e] border-[#d4af37]/35 text-[#fae69e] hover:border-[#fae69e] hover:bg-[#201a12] shadow-xs'
                    : 'bg-white border-[#e7e4dc] text-[#8f6208] hover:border-[#b89120] hover:bg-[#faf8f5] shadow-xs'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>

              {!isCollapsed && (
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-[0.2em] truncate ${
                    isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                  }`}
                >
                  Navigation
                </span>
              )}
            </div>
          </div>

          {/* Navigation Items (4 sections: compact icon-only when collapsed, full row when expanded) */}
          <nav
            id="sidebar-nav-list"
            className={
              isCollapsed
                ? 'px-2 py-4 space-y-3 flex flex-col items-center'
                : 'px-3 py-4 space-y-2'
            }
          >
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComp = item.icon;
              const label = t(item.nameKey, item.defaultLabel);

              if (isCollapsed) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    id={`sidebar-link-${item.id}`}
                    title={label}
                    className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-[#241c0e] text-[#fae69e] border border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                          : 'bg-[#fae69e]/60 text-[#78590c] border border-[#b89120] shadow-sm font-bold'
                        : isDark
                        ? 'bg-[#14120e]/60 text-[#aba79c] hover:text-[#fae69e] hover:bg-[#1a1610] border border-white/5'
                        : 'bg-black/5 text-[#635f56] hover:text-[#1a1813] hover:bg-black/10 border border-black/5'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </Link>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  id={`sidebar-link-${item.id}`}
                  title={label}
                  className={`group relative flex items-center gap-3 rounded-xl text-sm font-medium px-3.5 py-3 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-[#fae69e]/20 via-[#d4af37]/10 to-transparent border-l-4 border-[#d4af37] text-[#fae69e] font-semibold shadow-[inset_0_0_15px_rgba(212,175,55,0.1)]'
                        : 'bg-gradient-to-r from-[#fae69e]/50 via-[#d4af37]/25 to-transparent border-l-4 border-[#b89120] text-[#78590c] font-bold shadow-xs'
                      : isDark
                      ? 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-white/5 border-l-4 border-transparent'
                      : 'text-[#635f56] hover:text-[#1a1813] hover:bg-black/5 border-l-4 border-transparent'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-[#241c0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                          : 'bg-[#fae69e] text-[#78590c] border border-[#b89120]/50 shadow-[0_0_8px_rgba(212,175,55,0.2)]'
                        : isDark
                        ? 'bg-[#14120e]/60 text-[#aba79c] group-hover:text-[#fae69e] group-hover:bg-[#1a1610] border border-white/5'
                        : 'bg-black/5 text-[#635f56] group-hover:text-[#1a1813] group-hover:bg-black/10 border border-black/5'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  <span className="truncate tracking-wide">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE DRAWER SIDEBAR (SLIDES FROM LEFT ON MOBILE)                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-4/5 max-w-xs h-full flex flex-col justify-between shadow-2xl border-r z-10 ${
                isDark
                  ? 'bg-[#0c0b08] border-[#d4af37]/35 text-[#fcfbf7]'
                  : 'bg-white border-[#e7e4dc] text-[#1c1917]'
              }`}
            >
              <div>
                {/* Drawer Header: Clean Title & Close Button (No duplicate logo/symbol) */}
                <div className={`h-20 px-5 flex items-center justify-between border-b ${isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'}`}>
                  <span className={`font-mono text-xs uppercase tracking-[0.2em] font-bold ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>
                    Navigation
                  </span>

                  <button
                    type="button"
                    onClick={closeMobile}
                    className={`p-2 rounded-lg border transition-colors ${
                      isDark
                        ? 'text-[#aba79c] hover:text-[#fae69e] hover:bg-white/5 border-[#d4af37]/25'
                        : 'text-[#78716c] hover:text-[#1c1917] hover:bg-black/5 border-[#e7e4dc]'
                    }`}
                    aria-label="Close sidebar menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Items (ONLY the 4 required sections) */}
                <div className="p-4 space-y-2">
                  {SIDEBAR_NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    const IconComp = item.icon;
                    const label = t(item.nameKey, item.defaultLabel);

                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={closeMobile}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                          isActive
                            ? isDark
                              ? 'bg-[#221c0e] border-[#d4af37] text-[#fae69e] shadow-md font-bold'
                              : 'bg-[#fae69e]/40 border-[#b89120] text-[#78590c] shadow-xs font-bold'
                            : isDark
                            ? 'bg-[#14120e]/60 border-[#d4af37]/20 text-[#aba79c] hover:text-[#fcfbf7]'
                            : 'bg-white border-[#e7e4dc] text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isActive
                                ? 'bg-[#d4af37]/20 text-[#fae69e] border border-[#d4af37]'
                                : isDark
                                ? 'bg-[#1a1710] border border-[#d4af37]/30 text-[#fae69e]'
                                : 'bg-[#f4efe6] border border-[#d4af37]/35 text-[#78590c]'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span>{label}</span>
                        </div>
                        {isActive && <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-xs" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
