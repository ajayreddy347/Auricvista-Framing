import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Wheat,
  ShoppingBag,
  Tractor,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  User,
  LogOut,
  Settings,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  CheckCircle2,
  Lock,
  Globe,
  Check,
  Sprout,
  Leaf,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../translations';
import { useSidebar } from '../context/SidebarContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { isCollapsed, isMobileOpen, toggleMobile } = useSidebar();
  const { isDark } = useTheme();
  const { isLoggedIn, userRole, user, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const { language, setLanguage, t, supportedLanguages, currentLanguageMeta } = useLanguage();

  // Scroll position detector within the current page
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLanguageDropdownOpen(false);
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body/page scroll when language dropdown or settings modal is active
  useEffect(() => {
    if (settingsModalOpen || languageDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [settingsModalOpen, languageDropdownOpen]);

  // Close profile and language dropdown on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setLanguageDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSelectLanguage = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setLanguageDropdownOpen(false);
  };

  return (
    <>
      <header
        id="auricarohi-sticky-navbar"
        className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'lg:left-20' : 'lg:left-64'
        } left-0 ${
          scrolled
            ? isDark
              ? 'bg-[#070707]/92 backdrop-blur-xl border-b border-[#d4af37]/25 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
              : 'bg-white/95 backdrop-blur-xl border-b border-[#e7e4dc] shadow-sm text-[#1c1917]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE: MAIN AURIC AROHI BRANDING & AVANI PLATFORM LINK                */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 h-full">
            {/* Mobile Hamburger Button at Top-Left on Mobile */}
            <button
              type="button"
              id="mobile-header-hamburger-btn"
              onClick={toggleMobile}
              aria-label="Toggle navigation menu"
              className={`lg:hidden p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-[#12110c] border-[#d4af37]/40 text-[#fae69e] hover:text-white'
                  : 'bg-white border-[#e7e4dc] text-[#8f6208] hover:text-[#1c1917]'
              }`}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand container: Auric Arohi above, Auric Avani vertically BELOW */}
            <div className="flex flex-col justify-center py-1 select-none">
              {/* Main Auric Arohi Brand Logo & Symbol */}
              <Link
                to="/"
                id="nav-logo-link"
                className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
              >
                {/* Official Auric Arohi Mountain Crest Logo */}
                <img
                  src="/assets/logo/auric-arohi-logo.png"
                  alt="Auric Arohi Logo"
                  className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-transform duration-300"
                />

                <div className="flex flex-col">
                  <span
                    className={`font-serif text-base sm:text-lg font-bold tracking-[0.2em] transition-colors leading-none uppercase ${
                      isDark
                        ? 'text-[#fae69e] group-hover:text-[#ffffff]'
                        : 'text-[#8f6208] group-hover:text-[#b8860b]'
                    }`}
                  >
                    {t('nav.brand', 'AURIC AROHI')}
                  </span>
                  <span
                    className={`hidden sm:block text-[8px] font-mono tracking-[0.16em] uppercase mt-0.5 ${
                      isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'
                    }`}
                  >
                    {t('nav.tagline', 'Direct From the Farm')}
                  </span>
                </div>
              </Link>

              {/* Auric Avani Sister Platform positioned vertically BELOW Auric Arohi */}
              <div className="mt-1 flex items-center">
                <Link
                  to="/avani"
                  id="header-avani-pill"
                  title="Auric Avani — Agri-Waste to Wealth Sister Platform"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium transition-all group cursor-pointer ${
                    isDark
                      ? 'bg-[#18150e]/90 border-[#d4af37]/45 text-[#fae69e] hover:border-[#fae69e] hover:bg-[#261f12] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                      : 'bg-[#faf7f0] border-[#d4af37]/60 text-[#8f6208] hover:bg-[#f3ebd7] hover:border-[#b89120] shadow-xs'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  <span className="font-serif font-bold tracking-[0.14em] uppercase text-[10px]">
                    AURIC AVANI
                  </span>
                  <span
                    className={`text-[8.5px] font-mono tracking-wider uppercase ${
                      isDark ? 'text-[#c2bcad]' : 'text-[#857d6f]'
                    }`}
                  >
                    • Sister Platform
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FAR RIGHT: CONTROLS (LANGUAGE SELECTOR + CART + AUTH STATE) (DESKTOP)     */}
          {/* ========================================================================= */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            
            <ThemeToggle />

            {/* 🌐 MULTI-LANGUAGE SELECTOR DROPDOWN */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                id="language-selector-btn"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                aria-label="Change Language"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-medium backdrop-blur-md transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-[#12110c]/90 border-[#d4af37]/35 hover:border-[#fae69e] text-[#fae69e] shadow-[0_0_12px_-4px_rgba(212,175,55,0.25)]'
                    : 'bg-white border-[#e7e4dc] hover:border-[#b89120] text-[#8f6208] shadow-xs'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                <span className="font-mono text-[11px] font-semibold tracking-wider">
                  {currentLanguageMeta.nativeName}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'} ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {languageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    onWheel={(e) => e.stopPropagation()}
                    className={`absolute right-0 top-full mt-2 w-52 rounded-2xl border shadow-2xl backdrop-blur-2xl z-50 overflow-hidden flex flex-col ${
                      isDark
                        ? 'bg-[#0c0b09]/98 border-[#d4af37]/40 shadow-[0_15px_40px_rgba(0,0,0,0.9)]'
                        : 'bg-white border-[#e7e4dc] shadow-2xl text-[#1c1917]'
                    }`}
                  >
                    {/* Fixed Dropdown Header */}
                    <div
                      className={`px-3.5 py-2.5 text-[10px] font-mono uppercase tracking-widest font-semibold border-b shrink-0 flex items-center justify-between select-none ${
                        isDark
                          ? 'text-[#fae69e] bg-[#14120e] border-[#d4af37]/20'
                          : 'text-[#8f6208] bg-[#fbf9f4] border-[#e7e4dc]'
                      }`}
                    >
                      <span>Select Language</span>
                      <span className="text-[9px] opacity-75 font-normal">
                        ({supportedLanguages.length})
                      </span>
                    </div>

                    {/* Scrollable Language List with Internal Scroll Only and overscroll-contain */}
                    <div
                      id="language-dropdown-scroll-list"
                      className="max-h-[min(340px,calc(100vh-8.5rem))] overflow-y-auto overscroll-contain py-1"
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      {supportedLanguages.map((lang) => {
                        const isSelected = lang.code === language;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleSelectLanguage(lang.code)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? 'bg-[#221c0e] text-[#fae69e] font-semibold border-l-2 border-[#d4af37]'
                                  : 'bg-[#fbf9f4] text-[#8f6208] font-bold border-l-2 border-[#b89120]'
                                : isDark
                                ? 'text-[#aba79c] hover:text-[#f5f3eb] hover:bg-white/5 border-l-2 border-transparent'
                                : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5] border-l-2 border-transparent'
                            }`}
                          >
                            <div>
                              <span className="block font-medium leading-tight">{lang.nativeName}</span>
                              <span
                                className={`block text-[10px] font-mono mt-0.5 ${
                                  isDark ? 'text-[#8e8b82]' : 'text-[#a8a29e]'
                                }`}
                              >
                                {lang.label}
                              </span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CART TRIGGER BUTTON */}
            {(!isLoggedIn || userRole === 'customer') && (
              <button
                type="button"
                id="header-cart-btn"
                onClick={openCart}
                aria-label={`Open Cart (${totalItems} items)`}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium backdrop-blur-md transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-[#12110c]/90 border-[#d4af37]/35 hover:border-[#fae69e] text-[#fae69e] shadow-[0_0_12px_-4px_rgba(212,175,55,0.25)]'
                    : 'bg-white border-[#e7e4dc] hover:border-[#b89120] text-[#8f6208] shadow-xs'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                <span className="hidden lg:inline text-[11px] font-mono tracking-wider font-semibold">
                  {t('cart.title', 'Cart')}
                </span>
                {totalItems > 0 && (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-[#d4af37] text-[#0a0a0a] text-[10px] font-mono font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* ========================================================================= */}
            {/* AUTH STATE: USER MENU OR "JOIN AURIC AROHI" PRIMARY CTA                  */}
            {/* ========================================================================= */}
            {isLoggedIn && user ? (
              /* LOGGED IN USER PROFILE TRIGGER & DROPDOWN */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer group ${
                    isDark
                      ? 'bg-[#14120e] border-[#d4af37]/40 hover:border-[#fae69e]'
                      : 'bg-white border-[#e7e4dc] hover:border-[#b89120] shadow-xs'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6b18] text-[#0a0a0a] font-bold text-xs flex items-center justify-center shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-xs font-medium max-w-[110px] truncate ${
                    isDark ? 'text-[#fcfbf7] group-hover:text-[#fae69e]' : 'text-[#1c1917] group-hover:text-[#8f6208]'
                  }`}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'} transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-2 w-64 rounded-2xl border backdrop-blur-2xl py-2 z-50 divide-y ${
                        isDark
                          ? 'bg-[#0c0b09] border-[#d4af37]/40 shadow-[0_10px_40px_rgba(0,0,0,0.9)] divide-[#d4af37]/15'
                          : 'bg-white border-[#e7e4dc] shadow-2xl divide-[#e7e4dc] text-[#1c1917]'
                      }`}
                    >
                      {/* User Header */}
                      <div className="px-4 py-3">
                        <p className={`text-xs font-bold truncate ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>{user.name}</p>
                        <p className={`text-[11px] truncate font-mono ${isDark ? 'text-[#aba79c]' : 'text-[#78716c]'}`}>{user.email || user.phone}</p>
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono ${
                          isDark ? 'bg-[#1e190e] border-[#d4af37]/30 text-[#d4af37]' : 'bg-[#fbf9f4] border-[#d4af37]/40 text-[#8f6208]'
                        }`}>
                          <ShieldCheck className="w-3 h-3 text-[#16a34a]" />
                          <span className="uppercase tracking-wider">
                            {userRole === 'farmer' ? t('nav.roleFarmer', 'Verified Grower') : t('nav.roleCustomer', 'Direct Patron')}
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Links */}
                      <div className="py-1 px-2 space-y-0.5">
                        <Link
                          to={userRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard'}
                          onClick={() => setProfileDropdownOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            isDark
                              ? 'text-[#aba79c] hover:text-[#fae69e] hover:bg-[#18150d]'
                              : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
                          }`}
                        >
                          <LayoutDashboard className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                          <span>{t('nav.dashboard', 'My Dashboard')}</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setSettingsModalOpen(true);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                            isDark
                              ? 'text-[#aba79c] hover:text-[#fae69e] hover:bg-[#18150d]'
                              : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
                          }`}
                        >
                          <Settings className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                          <span>{t('nav.profileSettings', 'Profile Settings')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#dc2626] hover:bg-[#fef2f2] transition-colors text-left cursor-pointer mt-1 border-t pt-2 ${
                            isDark ? 'border-[#d4af37]/10 hover:bg-[#200d0d]' : 'border-[#e7e4dc]'
                          }`}
                        >
                          <LogOut className="w-4 h-4 text-[#dc2626]" />
                          <span>{t('nav.logout', 'Sign Out')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* LOGGED OUT STATE BUTTONS - ONLY "JOIN AURIC AROHI" PRIMARY CTA (NO SEPARATE SIGN IN) */
              <div className="flex items-center gap-2">
                <Link
                  to="/signup"
                  id="nav-register-btn"
                  className="relative group px-4 py-2 rounded-full text-xs font-semibold text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_-3px_rgba(212,175,55,0.45)] hover:shadow-[0_0_28px_0_rgba(212,175,55,0.6)] active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0a0a0a]" />
                  <span className="relative z-10 uppercase tracking-wider">{t('nav.register', 'Join Auric Arohi')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* MOBILE CONTROLS TRIGGER: THEME TOGGLE + CART + HAMBURGER                  */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            {(!isLoggedIn || userRole === 'customer') && (
              <button
                type="button"
                id="header-mobile-cart-btn"
                onClick={openCart}
                aria-label={`Open Cart (${totalItems} items)`}
                className={`relative p-2 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-[#12110c] border-[#d4af37]/35 text-[#fae69e]'
                    : 'bg-white border-[#e7e4dc] text-[#8f6208]'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#d4af37] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* PROFILE SETTINGS MODAL                                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {settingsModalOpen && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative z-10 w-full max-w-md rounded-3xl border-2 p-6 sm:p-7 shadow-2xl ${
                isDark
                  ? 'bg-[#0e0d0b] border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.3)] text-[#fcfbf7]'
                  : 'bg-white border-[#e7e4dc] shadow-2xl text-[#1c1917]'
              }`}
            >
              <div className={`flex items-center justify-between pb-4 mb-5 border-b ${isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'}`}>
                <div className="flex items-center gap-2.5">
                  <Settings className={`w-5 h-5 ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`} />
                  <h3 className={`font-serif text-lg font-bold ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                    {t('nav.profile', 'Profile & Settings')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className={`p-1 rounded-lg cursor-pointer ${isDark ? 'text-[#8e8b82] hover:text-white' : 'text-[#78716c] hover:text-[#1c1917]'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-[#14120e] border-[#d4af37]/20' : 'bg-[#faf8f5] border-[#e7e4dc]'
                }`}>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}>Account Type</span>
                    <span className={`font-mono uppercase font-bold ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}>Full Name</span>
                    <span className={`font-medium ${isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'}`}>{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}>Email</span>
                    <span className={`font-mono ${isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'}`}>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}>Phone</span>
                      <span className={`font-mono ${isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'}`}>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}>Location</span>
                      <span className={isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'}>{user.location}</span>
                    </div>
                  )}
                </div>

                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                  isDark ? 'bg-[#18150d] border-[#d4af37]/30 text-[#aba79c]' : 'bg-[#fbf9f4] border-[#d4af37]/40 text-[#57534e]'
                }`}>
                  <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Direct Farm Fair Trade Protocol Active.</span>
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t flex justify-end ${isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'}`}>
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 transition-all cursor-pointer shadow-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
