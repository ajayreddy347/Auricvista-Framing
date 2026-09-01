import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Footer } from '../components/Footer';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isLoggedIn, userRole: currentRole } = useAuth();

  // Pre-select role if URL has ?role=farmer or ?role=customer
  const initialRoleParam = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    initialRoleParam === 'farmer' || initialRoleParam === 'customer'
      ? (initialRoleParam as UserRole)
      : null
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (isLoggedIn && currentRole) {
      navigate(currentRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard', { replace: true });
    }
  }, [isLoggedIn, currentRole, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    // Prefill demo email for smooth testing
    if (role === 'farmer') {
      setEmail('ravi.kumar@karnataka-organic.farm');
    } else {
      setEmail('ananya.sharma@auricvista.com');
    }
    setPassword('••••••••');
  };

  const handleSwitchRole = () => {
    setSelectedRole(null);
    setErrorMessage('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedRole) {
      setErrorMessage('Please select whether you are a Farmer or a Customer.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const authenticatedUser = await login(email, password, selectedRole);
      navigate(authenticatedUser.role === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#fcfbf7] flex flex-col justify-between pt-24 sm:pt-28">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-center">
        {/* Header Eyebrow & Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/90 border border-[#d4af37]/40 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(212,175,55,0.25)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#fae69e] uppercase">
              AURICVISTA ACCESS PORTAL
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#fcfbf7]">
            Sign In to AuricVista
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#aba79c] font-sans">
            Direct farmer-to-consumer exchange with zero intermediary margins.
          </p>
        </div>

        {/* ======================================================================= */}
        {/* INTERACTIVE ROLE SELECTION OR FORM                                      */}
        {/* ======================================================================= */}
        <div className="max-w-xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              /* ================================================================= */
              /* STEP 1: DUAL ROLE SELECTOR CARDS                                  */
              /* ================================================================= */
              <motion.div
                key="role-selector"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37]">
                    Select Your Role to Continue
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Card 1: Farmer */}
                  <div
                    id="login-role-farmer-card"
                    onClick={() => handleRoleSelect('farmer')}
                    className="group relative p-6 sm:p-7 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/30 hover:border-[#d4af37] backdrop-blur-xl shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)] hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 rounded-full bg-[#fae69e] flex items-center justify-center text-[#0a0a0a]">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2a2310] to-[#12100a] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] mb-5 shadow-[0_0_20px_-3px_rgba(212,175,55,0.25)] group-hover:border-[#fae69e] group-hover:scale-105 transition-all">
                        <Tractor className="w-7 h-7" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors">
                        I'm a Farmer
                      </h3>
                      <p className="mt-2 text-xs text-[#9e9b92] leading-relaxed font-sans">
                        List daily harvest, manage direct buyer orders, view escrow settlements, and utilize AI crop advisory.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between text-xs font-mono text-[#d4af37]">
                      <span>Producer Portal</span>
                      <span className="font-bold uppercase tracking-wider">Log In →</span>
                    </div>
                  </div>

                  {/* Card 2: Customer */}
                  <div
                    id="login-role-customer-card"
                    onClick={() => handleRoleSelect('customer')}
                    className="group relative p-6 sm:p-7 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/30 hover:border-[#d4af37] backdrop-blur-xl shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)] hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 rounded-full bg-[#fae69e] flex items-center justify-center text-[#0a0a0a]">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2a2310] to-[#12100a] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] mb-5 shadow-[0_0_20px_-3px_rgba(212,175,55,0.25)] group-hover:border-[#fae69e] group-hover:scale-105 transition-all">
                        <User className="w-7 h-7" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors">
                        I'm a Customer
                      </h3>
                      <p className="mt-2 text-xs text-[#9e9b92] leading-relaxed font-sans">
                        Order verified morning harvests, set weekly recurring subscriptions, and support local growers directly.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between text-xs font-mono text-[#d4af37]">
                      <span>Consumer Hub</span>
                      <span className="font-bold uppercase tracking-wider">Log In →</span>
                    </div>
                  </div>
                </div>

                {/* Bottom link to Signup */}
                <div className="text-center pt-6">
                  <p className="text-xs text-[#8e8b82]">
                    New to AuricVista?{' '}
                    <Link
                      to="/signup"
                      className="text-[#fae69e] hover:underline font-semibold font-mono uppercase tracking-wider ml-1"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ================================================================= */
              /* STEP 2: ROLE-SPECIFIC LOGIN FORM                                  */
              /* ================================================================= */
              <motion.div
                key="login-form"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="p-7 sm:p-9 rounded-3xl bg-[#0e0d0b]/95 border-2 border-[#d4af37]/40 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.3)]"
              >
                {/* Form Header with Role Indicator & Switch Button */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#d4af37]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1f1b11] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e]">
                      {selectedRole === 'farmer' ? (
                        <Tractor className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#fcfbf7] leading-tight">
                        {selectedRole === 'farmer'
                          ? 'Farmer Portal Sign In'
                          : 'Customer Portal Sign In'}
                      </h2>
                      <span className="text-[11px] font-mono text-[#c9a227] uppercase tracking-wider">
                        Role: {selectedRole}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSwitchRole}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#16140e] border border-[#d4af37]/30 text-[11px] font-mono text-[#aba79c] hover:text-[#fae69e] hover:border-[#d4af37] transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Change Role</span>
                  </button>
                </div>

                {/* Error Banner if validation fails */}
                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-[#2a1010] border border-[#f87171]/50 text-[#fca5a5] text-xs flex items-center gap-2.5 font-sans">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5"
                    >
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          selectedRole === 'farmer'
                            ? 'farmer@organic-network.in'
                            : 'customer@gmail.com'
                        }
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="login-password"
                        className="block text-xs font-mono uppercase tracking-wider text-[#d4af37]"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setDemoNotice(true)}
                        className="text-[11px] font-mono text-[#9e9b92] hover:text-[#fae69e] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8e8b82] hover:text-[#fae69e]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Demo notification alert */}
                  {demoNotice && (
                    <div className="p-3 rounded-xl bg-[#18150d] border border-[#d4af37]/30 text-xs text-[#fae69e] flex items-center justify-between">
                      <span>Mock authentication active: Enter any email/password to sign in.</span>
                      <button
                        type="button"
                        onClick={() => setDemoNotice(false)}
                        className="text-white hover:underline text-[10px] font-mono"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      id="login-submit-btn"
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_25px_-5px_rgba(212,175,55,0.45)] hover:shadow-[0_0_35px_0_rgba(212,175,55,0.6)] active:scale-[0.99] transition-all duration-300 cursor-pointer disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>SIGN IN AS {selectedRole.toUpperCase()}</span>
                          <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer Switch to Sign Up */}
                <div className="mt-6 pt-5 border-t border-[#d4af37]/20 text-center">
                  <p className="text-xs text-[#8e8b82]">
                    Don't have an account yet?{' '}
                    <Link
                      to={`/signup?role=${selectedRole}`}
                      className="text-[#fae69e] hover:underline font-semibold font-mono uppercase tracking-wider ml-1"
                    >
                      Sign up as {selectedRole}
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};
