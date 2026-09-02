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
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../translations';

interface NavItem {
  nameKey: string;
  path: string;
  icon?: React.ElementType;
}

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, userRole, user, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const { language, setLanguage, t, supportedLanguages, currentLanguageMeta } = useLanguage();

  const navItems: NavItem[] = [
    { nameKey: 'nav.marketplace', path: '/marketplace', icon: ShoppingBag },
    { nameKey: 'nav.farmers', path: '/farmers', icon: Tractor },
    { nameKey: 'nav.howItWorks', path: '/how-it-works', icon: HelpCircle },
    { nameKey: 'nav.impact', path: '/impact', icon: TrendingUp },
    { nameKey: 'nav.trust', path: '/trust', icon: ShieldCheck },
  ];

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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when mobile overlay or modal is active
  useEffect(() => {
    if (mobileMenuOpen || settingsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, settingsModalOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setLanguageDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#070707]/92 backdrop-blur-xl border-b border-[#d4af37]/25 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE: "AURIC AROHI" WORDMARK LOGO + TAGLINE (Navigates to "/")        */}
          {/* ========================================================================= */}
          <Link
            to="/"
            id="nav-logo-link"
            className="flex items-center gap-3 group select-none cursor-pointer"
          >
            {/* Geometric Monogram Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#262010] to-[#0d0d0d] border border-[#d4af37]/45 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)] group-hover:border-[#fae69e] group-hover:scale-105 transition-all duration-300">
              <Wheat className="w-5 h-5 text-[#fae69e]" />
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.22em] text-[#fae69e] group-hover:text-[#ffffff] transition-colors leading-none uppercase drop-shadow-sm">
                {t('nav.brand', 'AURIC AROHI')}
              </span>
              <span className="hidden sm:block text-[10px] font-mono tracking-[0.18em] text-[#8e8b82] uppercase mt-1">
                {t('nav.tagline', 'Direct From the Farm')}
              </span>
            </div>
          </Link>

          {/* ========================================================================= */}
          {/* CENTER: HORIZONTAL NAV LINKS (DESKTOP)                                    */}
          {/* ========================================================================= */}
          <nav
            id="desktop-nav-links"
            className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[#12110c]/70 border border-[#d4af37]/20 backdrop-blur-md shadow-inner"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const label = t(item.nameKey, item.nameKey.replace('nav.', ''));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3.5 lg:px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-[#fae69e] font-semibold'
                      : 'text-[#aba79c] hover:text-[#f5f3eb] hover:bg-white/5'
                  }`}
                >
                  <span>{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_8px_#d4af37]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ========================================================================= */}
          {/* FAR RIGHT: CONTROLS (LANGUAGE SELECTOR + CART + AUTH STATE) (DESKTOP)     */}
          {/* ========================================================================= */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            
            {/* 🌐 MULTI-LANGUAGE SELECTOR DROPDOWN */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                id="language-selector-btn"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                aria-label="Change Language"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#12110c]/90 border border-[#d4af37]/35 hover:border-[#fae69e] text-[#fae69e] text-xs font-medium backdrop-blur-md shadow-[0_0_12px_-4px_rgba(212,175,55,0.25)] hover:shadow-[0_0_20px_-3px_rgba(212,175,55,0.4)] transition-all cursor-pointer group"
              >
                <Globe className="w-3.5 h-3.5 text-[#d4af37] group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[11px] font-semibold tracking-wider">
                  {currentLanguageMeta.nativeName}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#d4af37] transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {languageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto rounded-2xl bg-[#0f0e0b]/98 border border-[#d4af37]/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-1.5 z-50"
                  >
                    <div className="px-3 py-1.5 border-b border-[#d4af37]/15 mb-1 flex items-center justify-between sticky top-0 bg-[#0f0e0b] z-10">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8b82]">
                        {t('nav.language', 'Language')} ({supportedLanguages.length})
                      </span>
                      <Globe className="w-3 h-3 text-[#d4af37]" />
                    </div>

                    <div className="space-y-0.5">
                      {supportedLanguages.map((lang) => {
                        const isSelected = lang.code === language;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleSelectLanguage(lang.code)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                              isSelected
                                ? 'bg-[#221c0e] text-[#fae69e] font-semibold border border-[#d4af37]/40'
                                : 'text-[#aba79c] hover:text-[#f5f3eb] hover:bg-white/5'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{lang.nativeName}</span>
                              <span className="text-[10px] text-[#716e66] font-mono">{lang.label}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#34d399]" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Icon Trigger (Visible for Customers & General Browsers) */}
            {(!isLoggedIn || userRole === 'customer') && (
              <button
                type="button"
                onClick={openCart}
                id="nav-cart-trigger-btn"
                title={t('nav.cart', 'Harvest Cart')}
                className="relative p-2.5 rounded-full bg-[#12110c]/90 border border-[#d4af37]/40 hover:border-[#fae69e] text-[#fae69e] backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_-3px_rgba(212,175,55,0.4)] transition-all cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4 text-[#fae69e] group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] text-[10px] font-mono font-bold flex items-center justify-center border border-[#0a0a0a] shadow-[0_0_10px_rgba(212,175,55,0.6)] animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {isLoggedIn && user ? (
              /* LOGGED IN USER PROFILE DROPDOWN */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#14120e] border border-[#d4af37]/40 hover:border-[#fae69e] backdrop-blur-md transition-all cursor-pointer group"
                >
                  {/* Monogram Avatar */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6b18] text-[#0a0a0a] font-bold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + Role Badge */}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors leading-tight max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#d4af37] leading-none">
                      {userRole === 'farmer' ? t('nav.roleFarmer', 'Grower') : t('nav.roleCustomer', 'Patron')}
                    </span>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-[#8e8b82] group-hover:text-[#fae69e] transition-colors" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f0e0b]/98 border border-[#d4af37]/40 shadow-[0_10px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-2 z-50"
                    >
                      {/* User Header in Dropdown */}
                      <div className="p-3 border-b border-[#d4af37]/20 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#fcfbf7] truncate">{user.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#262010] border border-[#d4af37]/40 text-[9px] font-mono text-[#fae69e] uppercase">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#8e8b82] truncate mt-0.5">{user.email}</p>
                      </div>

                      {/* Dropdown Links */}
                      <div className="space-y-1">
                        <Link
                          to={userRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard'}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#aba79c] hover:text-[#fae69e] hover:bg-[#1a1710] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
                          <span>{t('nav.dashboard', 'Dashboard')}</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setSettingsModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#aba79c] hover:text-[#fae69e] hover:bg-[#1a1710] transition-colors text-left cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-[#d4af37]" />
                          <span>{t('nav.profile', 'Profile Settings')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#fca5a5] hover:text-[#f87171] hover:bg-[#200d0d] transition-colors text-left cursor-pointer mt-1 border-t border-[#d4af37]/10 pt-2"
                        >
                          <LogOut className="w-4 h-4 text-[#f87171]" />
                          <span>{t('nav.logout', 'Sign Out')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* LOGGED OUT STATE BUTTONS */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="nav-signin-btn"
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#aba79c] hover:text-[#fae69e] hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>

                <Link
                  to="/signup"
                  id="nav-register-btn"
                  className="relative group px-4 py-1.5 rounded-full text-xs font-semibold text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_-3px_rgba(212,175,55,0.45)] hover:shadow-[0_0_28px_0_rgba(212,175,55,0.6)] active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <span className="relative z-10 uppercase tracking-wider">{t('nav.register', 'Join Auric Arohi')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* MOBILE HAMBURGER BUTTON TRIGGER                                           */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart Trigger */}
            {(!isLoggedIn || userRole === 'customer') && (
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 rounded-lg bg-[#14120e] border border-[#d4af37]/30 text-[#fae69e]"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#d4af37] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#12110c] border border-[#d4af37]/40 text-[#fae69e] hover:text-white transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER OVERLAY                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-20 z-40 bg-[#070707]/98 backdrop-blur-2xl border-b border-[#d4af37]/30 px-6 py-6 flex flex-col justify-between overflow-y-auto md:hidden"
          >
            <div className="space-y-5">
              {/* User Bar in Mobile (If Logged In) */}
              {isLoggedIn && user && (
                <div className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8a6b18] text-[#0a0a0a] font-bold text-sm flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#fcfbf7]">{user.name}</p>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37]">
                        {userRole === 'farmer' ? t('nav.roleFarmer', 'Verified Grower') : t('nav.roleCustomer', 'Direct Patron')}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={userRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-[#201a0f] border border-[#d4af37]/40 text-[#fae69e]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* 🌐 Mobile Language Switcher Selector */}
              <div className="p-3.5 rounded-2xl bg-[#14120e] border border-[#d4af37]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d4af37]">
                  <Globe className="w-4 h-4" />
                  <span>{t('nav.language', 'Language')}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {supportedLanguages.map((lang) => {
                    const isSelected = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`py-2 px-1.5 rounded-xl text-center text-xs transition-all ${
                          isSelected
                            ? 'bg-[#221c0e] text-[#fae69e] font-semibold border border-[#d4af37]'
                            : 'bg-[#0f0e0c] text-[#aba79c] border border-white/5'
                        }`}
                      >
                        <span className="block font-medium">{lang.nativeName}</span>
                        <span className="block text-[9px] text-[#6e6b63]">{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nav Items List */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8e8b82] px-2">
                  Navigation
                </p>

                <div className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const IconComp = item.icon || Sparkles;
                    const label = t(item.nameKey, item.nameKey.replace('nav.', ''));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left font-serif text-base transition-all ${
                          isActive
                            ? 'bg-[#18150d] border-[#d4af37] text-[#fae69e] shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)]'
                            : 'bg-[#100f0c] border-[#d4af37]/20 text-[#f5f3eb] hover:border-[#d4af37]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1a1710] border border-[#d4af37]/30 flex items-center justify-center text-[#fae69e]">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="font-medium tracking-wide">{label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#d4af37]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 pb-2 space-y-3 border-t border-[#d4af37]/20">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-[#fca5a5] bg-[#220d0d] border border-[#f87171]/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#f87171]" />
                  <span>{t('nav.logout', 'Sign Out')}</span>
                </button>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-[#f5f3eb] bg-[#14120c] border border-[#d4af37]/45 text-center flex items-center justify-center gap-1.5"
                    >
                      <span>{t('nav.signIn', 'Sign In')}</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-center flex items-center justify-center gap-1.5"
                    >
                      <span>{t('nav.register', 'Sign Up')}</span>
                    </Link>
                  </div>

                  <Link
                    to="/login?role=farmer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-[#fae69e] bg-[#18150e] border border-[#d4af37]/40 flex items-center justify-center gap-2"
                  >
                    <span>{t('hero.farmerBtn', 'Join as Verified Grower')}</span>
                    <Tractor className="w-4 h-4 text-[#d4af37]" />
                  </Link>
                </>
              )}

              <p className="text-center text-[10px] font-mono text-[#6e6b63] pt-2">
                AURIC AROHI • DIRECT FROM THE FARM
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-[#0e0d0b] border-2 border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.3)] p-6 sm:p-7"
            >
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#d4af37]/20">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-[#fae69e]" />
                  <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
                    {t('nav.profile', 'Profile & Settings')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="p-1 rounded-lg text-[#8e8b82] hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="p-3.5 rounded-xl bg-[#14120e] border border-[#d4af37]/20 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8e8b82]">Account Type</span>
                    <span className="font-mono text-[#fae69e] uppercase">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e8b82]">Full Name</span>
                    <span className="text-[#f5f3eb] font-medium">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e8b82]">Email</span>
                    <span className="text-[#f5f3eb] font-mono">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex justify-between">
                      <span className="text-[#8e8b82]">Phone</span>
                      <span className="text-[#f5f3eb] font-mono">{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex justify-between">
                      <span className="text-[#8e8b82]">Location</span>
                      <span className="text-[#f5f3eb]">{user.location}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#18150d] border border-[#d4af37]/30 text-xs text-[#aba79c] flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#34d399] shrink-0" />
                  <span>Direct Farm Fair Trade Protocol Active.</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] bg-[#fae69e] hover:brightness-110 transition-all cursor-pointer"
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
