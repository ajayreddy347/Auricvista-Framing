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
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavItem {
  name: string;
  path: string;
  icon?: React.ElementType;
}

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, userRole, user, logout } = useAuth();
  const { totalItems, openCart } = useCart();

  const navItems: NavItem[] = [
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Farmers', path: '/farmers', icon: Tractor },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle },
    { name: 'Impact', path: '/impact', icon: TrendingUp },
    { name: 'Trust', path: '/trust', icon: ShieldCheck },
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

  // Click outside listener to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
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
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        id="auricvista-sticky-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#070707]/92 backdrop-blur-xl border-b border-[#d4af37]/25 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE: "AURICVISTA" WORDMARK LOGO + TAGLINE (Navigates to "/")        */}
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
                AURICVISTA
              </span>
              <span className="hidden sm:block text-[10px] font-mono tracking-[0.18em] text-[#8e8b82] uppercase mt-1">
                Direct From the Farm
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
                  <span>{item.name}</span>
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
          {/* FAR RIGHT: AUTH STATE CONTROLS (DESKTOP)                                  */}
          {/* ========================================================================= */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Icon Trigger (Visible for Customers & General Browsers) */}
            {(!isLoggedIn || userRole === 'customer') && (
              <button
                type="button"
                onClick={openCart}
                id="nav-cart-trigger-btn"
                title="View Harvest Cart"
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
              /* LOGGED-IN STATE: Role Dashboard Button + Profile Dropdown */
              <div className="flex items-center gap-3" ref={dropdownRef}>
                {/* Role Specific Action Button */}
                {userRole === 'farmer' ? (
                  <Link
                    to="/farmer-dashboard"
                    id="nav-farmer-portal-btn"
                    className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider text-[#fae69e] bg-[#1a1710] border border-[#d4af37]/50 hover:border-[#fae69e] shadow-[0_0_15px_-4px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
                  >
                    <Tractor className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>My Farm Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/customer-dashboard"
                    id="nav-customer-portal-btn"
                    className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider text-[#fae69e] bg-[#1a1710] border border-[#d4af37]/50 hover:border-[#fae69e] shadow-[0_0_15px_-4px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>My Orders</span>
                  </Link>
                )}

                {/* Profile / Avatar Dropdown Trigger */}
                <div className="relative">
                  <button
                    id="nav-profile-dropdown-trigger"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#12110c]/90 border border-[#d4af37]/40 hover:border-[#fae69e] backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#fae69e] to-[#b89120] text-[#0a0a0a] flex items-center justify-center font-bold text-xs shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-[#f5f3eb] max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#d4af37] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0d0c0a]/98 border border-[#d4af37]/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl p-2 z-50 divide-y divide-[#d4af37]/15"
                      >
                        {/* User Profile Card */}
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold font-serif text-[#fcfbf7] truncate">
                              {user.name}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#1e1a10] border border-[#d4af37]/40 text-[#fae69e]">
                              {user.role}
                            </span>
                          </div>
                          <p className="text-xs text-[#8e8b82] font-mono truncate">
                            {user.email}
                          </p>
                          {user.location && (
                            <p className="text-[11px] text-[#6e6b63] font-sans flex items-center gap-1 mt-1 truncate">
                              <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </p>
                          )}
                        </div>

                        {/* Dropdown Links */}
                        <div className="py-1.5 space-y-1">
                          <Link
                            to={userRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard'}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#e8dfca] hover:text-[#fae69e] hover:bg-[#18150d] transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
                            <span>Control Dashboard</span>
                          </Link>

                          {userRole === 'farmer' && (
                            <Link
                              to="/farmer-dashboard/post-produce"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#fae69e] hover:text-[#ffffff] hover:bg-[#201a0e] transition-colors font-medium"
                            >
                              <Wheat className="w-4 h-4 text-[#fae69e]" />
                              <span>List New Produce +</span>
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              setSettingsModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#e8dfca] hover:text-[#fae69e] hover:bg-[#18150d] transition-colors cursor-pointer text-left"
                          >
                            <Settings className="w-4 h-4 text-[#d4af37]" />
                            <span>Profile & Security</span>
                          </button>
                        </div>

                        {/* Logout Option */}
                        <div className="pt-1.5">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#fca5a5] hover:text-[#ffffff] hover:bg-[#2a1010] transition-colors cursor-pointer text-left"
                          >
                            <LogOut className="w-4 h-4 text-[#f87171]" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* LOGGED-OUT STATE: Join as Farmer + Start Shopping + Sign In */
              <div className="flex items-center gap-2.5">
                {/* Sign In Link */}
                <Link
                  to="/login"
                  id="nav-signin-link"
                  className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-[#aba79c] hover:text-[#fae69e] transition-colors"
                >
                  Sign In
                </Link>

                {/* Outlined Gold Button: "Join as Farmer" */}
                <Link
                  to="/login?role=farmer"
                  id="nav-join-farmer-btn"
                  className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider text-[#f5f3eb] bg-[#12110c]/80 hover:bg-[#d4af37]/15 border border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_-3px_rgba(212,175,55,0.4)] transition-all duration-300 cursor-pointer"
                >
                  <span>Join as Farmer</span>
                </Link>

                {/* Solid Gold Button: "Start Shopping" */}
                <Link
                  to="/marketplace"
                  id="nav-start-shopping-btn"
                  className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_-5px_rgba(212,175,55,0.45)] hover:shadow-[0_0_25px_0_rgba(212,175,55,0.6)] transition-all duration-300 cursor-pointer"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0a0a0a] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* MOBILE CONTROLS & HAMBURGER BUTTON                                        */}
          {/* ========================================================================= */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart Trigger */}
            {(!isLoggedIn || userRole === 'customer') && (
              <button
                type="button"
                onClick={openCart}
                id="mobile-cart-trigger-btn"
                className="relative p-2 rounded-xl bg-[#14120c] border border-[#d4af37]/40 text-[#fae69e] hover:text-white hover:border-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
                title="View Harvest Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#fae69e]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] text-[9px] font-mono font-bold flex items-center justify-center border border-[#0a0a0a]">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {isLoggedIn && user && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fae69e] to-[#b89120] text-[#0a0a0a] flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <button
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              className="p-2 rounded-xl bg-[#14120c] border border-[#d4af37]/40 text-[#fae69e] hover:text-white hover:border-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE FULL-SCREEN / EXPANDED OVERLAY                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            id="mobile-nav-overlay"
            className="fixed inset-0 top-20 z-40 bg-[#080808]/98 backdrop-blur-2xl border-b border-[#d4af37]/30 flex flex-col justify-between p-6 overflow-y-auto md:hidden"
          >
            {/* Top Area: Logged in profile banner or nav */}
            <div className="space-y-4 pt-2">
              {isLoggedIn && user ? (
                <div className="p-4 rounded-2xl bg-[#12100b] border border-[#d4af37]/40 shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fae69e] to-[#b89120] text-[#0a0a0a] flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#fcfbf7]">
                          {user.name}
                        </h4>
                        <p className="text-xs text-[#8e8b82] font-mono truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#1d190f] border border-[#d4af37]/40 text-[#fae69e]">
                      {user.role}
                    </span>
                  </div>

                  <div className={`grid ${userRole === 'farmer' ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mt-3 pt-3 border-t border-[#d4af37]/15`}>
                    <Link
                      to={userRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-2.5 rounded-xl bg-[#18150e] border border-[#d4af37]/30 text-xs font-mono text-center text-[#fae69e] truncate"
                    >
                      Dashboard
                    </Link>
                    {userRole === 'farmer' && (
                      <Link
                        to="/farmer-dashboard/post-produce"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 px-2.5 rounded-xl bg-[#1d190e] border border-[#d4af37]/50 text-xs font-mono text-center text-[#fcfbf7] truncate"
                      >
                        + Post Crop
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSettingsModalOpen(true);
                      }}
                      className="py-2 px-2.5 rounded-xl bg-[#18150e] border border-[#d4af37]/30 text-xs font-mono text-center text-[#e8dfca] truncate"
                    >
                      Settings
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Nav Links Stack */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9a227] block mb-2 px-2">
                  Navigation
                </span>

                <div className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const IconComp = item.icon || Sparkles;
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
                          <span className="font-medium tracking-wide">{item.name}</span>
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
                  className="w-full py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-[#fca5a5] bg-[#220d0d] border border-[#f87171]/40 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-[#f87171]" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-[#f5f3eb] bg-[#14120c] border border-[#d4af37]/45 text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Sign Up</span>
                    </Link>
                  </div>

                  <Link
                    to="/login?role=farmer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-[#fae69e] bg-[#18150e] border border-[#d4af37]/40 flex items-center justify-center gap-2"
                  >
                    <span>Join as Farmer</span>
                    <Tractor className="w-4 h-4 text-[#d4af37]" />
                  </Link>
                </>
              )}

              <p className="text-center text-[10px] font-mono text-[#6e6b63] pt-2">
                AURICVISTA • DIRECT FROM THE FARM
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* PROFILE SETTINGS PLACEHOLDER MODAL                                       */}
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
                    Profile & Escrow Settings
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="p-1 rounded-lg text-[#8e8b82] hover:text-white"
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
                  <span>Encrypted Zero-Intermediary Escrow Protocol Active.</span>
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
