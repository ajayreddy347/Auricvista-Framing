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
  KeyRound,
  Hash,
  Phone,
  HelpCircle,
  Check,
  Copy,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Footer } from '../components/Footer';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, farmerLoginPin, resetFarmerPin, isLoggedIn, userRole: currentRole } = useAuth();
  const { t } = useLanguage();

  // Pre-select role if URL has ?role=farmer or ?role=customer
  const initialRoleParam = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    initialRoleParam === 'farmer' || initialRoleParam === 'customer'
      ? (initialRoleParam as UserRole)
      : null
  );

  // Farmer login method: 'pin' (default) vs 'email'
  const [farmerLoginMethod, setFarmerLoginMethod] = useState<'pin' | 'email'>('pin');

  // Form Fields
  const [farmerId, setFarmerId] = useState('AV-FARM-1001');
  const [farmerPin, setFarmerPin] = useState('2026');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Forgot PIN Modal state
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);
  const [resetFarmerId, setResetFarmerId] = useState('');
  const [resetPhone, setResetPhone] = useState('');
  const [resetNewPin, setResetNewPin] = useState('');
  const [resetConfirmPin, setResetConfirmPin] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [resetErrorMessage, setResetErrorMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (isLoggedIn && currentRole) {
      navigate(currentRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard', { replace: true });
    }
  }, [isLoggedIn, currentRole, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'farmer') {
      setFarmerLoginMethod('pin');
      setFarmerId('AV-FARM-1001');
      setFarmerPin('2026');
      setEmail('ravi.kumar@auricvista.farm');
      setPassword('FarmPass@2026');
    } else {
      setEmail('ananya.sharma@auricvista.farm');
      setPassword('CustPass@2026');
    }
  };

  const handleSwitchRole = () => {
    setSelectedRole(null);
    setErrorMessage('');
    setEmail('');
    setPassword('');
    setFarmerId('AV-FARM-1001');
    setFarmerPin('2026');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    setIsLoading(true);

    try {
      if (selectedRole === 'farmer' && farmerLoginMethod === 'pin') {
        if (!farmerId.trim() || !farmerPin.trim()) {
          setIsLoading(false);
          setErrorMessage('Please enter both your Farmer ID and Security PIN.');
          return;
        }

        const userProfile = await farmerLoginPin(farmerId.trim(), farmerPin.trim());
        setIsLoading(false);
        navigate(userProfile.role === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard');
      } else {
        if (!email.trim() || !password) {
          setIsLoading(false);
          setErrorMessage('Please enter both your email address and password.');
          return;
        }

        const userProfile = await login(email.trim(), password);
        setIsLoading(false);
        navigate(userProfile.role === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMessage('');
    setResetSuccessMessage('');

    if (!resetFarmerId.trim() || !resetPhone.trim() || !resetNewPin.trim()) {
      setResetErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (resetNewPin.trim().length < 4) {
      setResetErrorMessage('Security PIN must be at least 4 digits.');
      return;
    }

    if (resetNewPin !== resetConfirmPin) {
      setResetErrorMessage('New PIN and Confirm PIN do not match.');
      return;
    }

    setIsResetting(true);

    try {
      const res = await resetFarmerPin(resetFarmerId.trim(), resetPhone.trim(), resetNewPin.trim());
      setIsResetting(false);
      setResetSuccessMessage(res.message || 'Security PIN reset successfully!');
      
      // Update form fields so farmer can login immediately
      setFarmerId(resetFarmerId.trim().toUpperCase());
      setFarmerPin(resetNewPin.trim());

      setTimeout(() => {
        setIsForgotPinOpen(false);
        setResetSuccessMessage('');
      }, 2500);
    } catch (err: any) {
      setIsResetting(false);
      setResetErrorMessage(err.message || 'Failed to reset PIN. Verify your Farmer ID and mobile number.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col justify-between bg-[#070707] text-[#f5f3eb] font-sans">
      {/* Background radial gold glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full gold-ambient-radial blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-md mx-auto w-full px-4 sm:px-6 my-auto">
        {/* Top Branding Eyebrow */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/35 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.2)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
              {t('auth.loginSubtitle', 'Direct Agricultural Access')}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#fcfbf7]">
            {t('auth.loginTitle', 'Sign In to Auric Arohi')}
          </h1>
          <p className="text-xs sm:text-sm text-[#aba79c] mt-2 max-w-xs mx-auto">
            Direct farmer-to-customer agricultural ecosystem.
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-3xl bg-[#0e0d0b]/90 border border-[#d4af37]/35 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.2)]">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              /* STEP 1: SELECT ROLE */
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                    {t('auth.selectRole', 'Select Account Profile')}
                  </span>
                  <p className="text-xs text-[#8e8b82] mt-1">
                    Choose how you wish to access the Auric Arohi ecosystem:
                  </p>
                </div>

                {/* Farmer Role Button */}
                <button
                  type="button"
                  id="login-select-farmer-btn"
                  onClick={() => handleRoleSelect('farmer')}
                  className="group w-full p-4 rounded-2xl bg-[#14120e] hover:bg-[#1c180e] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 flex items-center justify-between text-left card-lift-glow-subtle cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#262010] to-[#12100a] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] group-hover:scale-105 transition-transform shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)]">
                      <Tractor className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors">
                          {t('auth.asFarmer', 'Verified Farmer / Grower')}
                        </h3>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#34d399] bg-[#122818] px-1.5 py-0.5 rounded border border-[#34d399]/30">
                          ID + PIN
                        </span>
                      </div>
                      <p className="text-xs text-[#aba79c] leading-tight mt-0.5">
                        Post produce, manage orders, view revenue metrics
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#8e8b82] group-hover:text-[#fae69e] group-hover:translate-x-1 transition-all shrink-0" />
                </button>

                {/* Customer Role Button */}
                <button
                  type="button"
                  id="login-select-customer-btn"
                  onClick={() => handleRoleSelect('customer')}
                  className="group w-full p-4 rounded-2xl bg-[#14120e] hover:bg-[#1c180e] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 flex items-center justify-between text-left card-lift-glow-subtle cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#262010] to-[#12100a] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] group-hover:scale-105 transition-transform shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)]">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors">
                        {t('auth.asCustomer', 'Customer / Patron')}
                      </h3>
                      <p className="text-xs text-[#aba79c] leading-tight mt-0.5">
                        Browse marketplace, add to basket, track deliveries
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#8e8b82] group-hover:text-[#fae69e] group-hover:translate-x-1 transition-all shrink-0" />
                </button>

                <div className="pt-4 text-center">
                  <p className="text-xs text-[#8e8b82]">
                    {t('auth.noAccount', "Don't have an account?")}{' '}
                    <Link
                      to="/signup"
                      className="text-[#fae69e] hover:underline font-semibold font-mono uppercase tracking-wider ml-1"
                    >
                      {t('auth.signupBtn', 'Create Account')}
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* STEP 2: CREDENTIALS INPUT */
              <motion.div
                key="credentials-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header with Switch Role */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#d4af37]/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#1a1710] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e]">
                      {selectedRole === 'farmer' ? (
                        <Tractor className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#fcfbf7] leading-tight">
                        {selectedRole === 'farmer'
                          ? t('dash.farmerTitle', 'Farmer Portal Sign In')
                          : t('dash.customerTitle', 'Customer Portal Sign In')}
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
                    <span>Change</span>
                  </button>
                </div>

                {/* FARMER DUAL METHOD SELECTOR TABS */}
                {selectedRole === 'farmer' && (
                  <div className="mb-5 p-1 rounded-2xl bg-[#14120e] border border-[#d4af37]/30 flex items-center">
                    <button
                      type="button"
                      id="tab-farmer-pin"
                      onClick={() => {
                        setFarmerLoginMethod('pin');
                        setErrorMessage('');
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        farmerLoginMethod === 'pin'
                          ? 'bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-bold shadow-md'
                          : 'text-[#aba79c] hover:text-[#fae69e]'
                      }`}
                    >
                      <span>🌾 {t('auth.farmerIdPinTab', 'Farmer ID + PIN')}</span>
                      {farmerLoginMethod === 'pin' && (
                        <span className="text-[9px] uppercase px-1 py-0.2 bg-[#0a0a0a] text-[#fae69e] rounded">
                          ★
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      id="tab-farmer-email"
                      onClick={() => {
                        setFarmerLoginMethod('email');
                        setErrorMessage('');
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        farmerLoginMethod === 'email'
                          ? 'bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-bold shadow-md'
                          : 'text-[#aba79c] hover:text-[#fae69e]'
                      }`}
                    >
                      <span>📧 {t('auth.emailPasswordTab', 'Email + Password')}</span>
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-[#2a1010] border border-[#f87171]/50 text-[#fca5a5] text-xs flex items-center gap-2.5 font-sans">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedRole === 'farmer' && farmerLoginMethod === 'pin' ? (
                    /* ---------------------------------------------------- */
                    /* FARMER ID + PIN INPUTS (PRIMARY / DEFAULT)          */
                    /* ---------------------------------------------------- */
                    <>
                      {/* Farmer ID Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="login-farmer-id"
                            className="block text-xs font-mono uppercase tracking-wider text-[#d4af37]"
                          >
                            {t('auth.farmerId', 'Farmer ID')}
                          </label>
                          <span className="text-[10px] font-mono text-[#34d399] bg-[#102416] px-2 py-0.5 rounded border border-[#34d399]/30">
                            Verified Grower ID
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#d4af37]">
                            <Hash className="w-4 h-4" />
                          </div>
                          <input
                            id="login-farmer-id"
                            type="text"
                            value={farmerId}
                            onChange={(e) => setFarmerId(e.target.value.toUpperCase())}
                            placeholder="e.g. AV-FARM-1001"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/35 text-[#f5f3eb] placeholder-[#66635c] text-sm font-mono tracking-wider uppercase focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all"
                          />
                        </div>
                      </div>

                      {/* Security PIN Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="login-farmer-pin"
                            className="block text-xs font-mono uppercase tracking-wider text-[#d4af37]"
                          >
                            {t('auth.farmerPin', 'Security PIN')}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setResetFarmerId(farmerId || 'AV-FARM-1001');
                              setResetPhone('');
                              setResetNewPin('');
                              setResetConfirmPin('');
                              setResetErrorMessage('');
                              setResetSuccessMessage('');
                              setIsForgotPinOpen(true);
                            }}
                            className="text-xs text-[#fae69e] hover:underline font-mono"
                          >
                            {t('auth.forgotPin', 'Forgot PIN?')}
                          </button>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#d4af37]">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <input
                            id="login-farmer-pin"
                            type={showPin ? 'text' : 'password'}
                            inputMode="numeric"
                            maxLength={8}
                            value={farmerPin}
                            onChange={(e) => setFarmerPin(e.target.value)}
                            placeholder="••••"
                            required
                            className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/35 text-[#f5f3eb] placeholder-[#66635c] text-sm font-mono tracking-widest focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8e8b82] hover:text-[#fae69e] cursor-pointer"
                          >
                            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ---------------------------------------------------- */
                    /* EMAIL + PASSWORD INPUTS (SECONDARY / CUSTOMER)      */
                    /* ---------------------------------------------------- */
                    <>
                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="login-email"
                          className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5"
                        >
                          {t('auth.email', 'Email Address')}
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
                            placeholder="user@auricvista.farm"
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
                            {t('auth.password', 'Password')}
                          </label>
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
                            placeholder="••••••••••••"
                            required
                            className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8e8b82] hover:text-[#fae69e] cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
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
                          <span>
                            {selectedRole === 'farmer' && farmerLoginMethod === 'pin'
                              ? t('auth.loginWithPinBtn', 'Sign In with Farmer ID')
                              : t('auth.loginBtn', 'Sign In')}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Farmer Secondary Method Switch Link */}
                  {selectedRole === 'farmer' && (
                    <div className="text-center pt-2">
                      {farmerLoginMethod === 'pin' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setFarmerLoginMethod('email');
                            setErrorMessage('');
                          }}
                          className="text-xs text-[#aba79c] hover:text-[#fae69e] font-mono transition-colors"
                        >
                          {t('auth.loginWithEmail', 'Login with Email instead')} →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setFarmerLoginMethod('pin');
                            setErrorMessage('');
                          }}
                          className="text-xs text-[#aba79c] hover:text-[#fae69e] font-mono transition-colors"
                        >
                          ← {t('auth.loginWithFarmerId', 'Login with Farmer ID instead')}
                        </button>
                      )}
                    </div>
                  )}
                </form>

                {/* Footer Switch to Sign Up */}
                <div className="mt-6 pt-5 border-t border-[#d4af37]/20 text-center">
                  <p className="text-xs text-[#8e8b82]">
                    {t('auth.noAccount', "Don't have an account yet?")}{' '}
                    <Link
                      to={`/signup?role=${selectedRole}`}
                      className="text-[#fae69e] hover:underline font-semibold font-mono uppercase tracking-wider ml-1"
                    >
                      {t('auth.signupBtn', 'Create Account')}
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORGOT PIN RESET MODAL                                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isForgotPinOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-3xl bg-[#0e0d0b] border-2 border-[#d4af37]/45 p-6 sm:p-7 shadow-[0_0_50px_rgba(212,175,55,0.3)] space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1f1a10] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
                    {t('auth.resetPinTitle', 'Reset Farmer Security PIN')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotPinOpen(false)}
                  className="text-xs font-mono text-[#8e8b82] hover:text-[#fae69e] p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#aba79c] leading-relaxed">
                {t(
                  'auth.resetPinSubtitle',
                  'Enter your registered Farmer ID and registered mobile number to set a new security PIN.'
                )}
              </p>

              {resetErrorMessage && (
                <div className="p-3 rounded-xl bg-[#2a1010] border border-[#f87171]/50 text-[#fca5a5] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                  <span>{resetErrorMessage}</span>
                </div>
              )}

              {resetSuccessMessage && (
                <div className="p-3 rounded-xl bg-[#122818] border border-[#34d399]/50 text-[#86efac] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#34d399]" />
                  <span>{resetSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleResetPinSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1">
                    {t('auth.farmerId', 'Farmer ID')} *
                  </label>
                  <input
                    type="text"
                    value={resetFarmerId}
                    onChange={(e) => setResetFarmerId(e.target.value.toUpperCase())}
                    placeholder="e.g. AV-FARM-1001"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs sm:text-sm font-mono uppercase text-[#f5f3eb] focus:outline-none focus:border-[#fae69e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1">
                    {t('checkout.phone', 'Registered Mobile Number')} *
                  </label>
                  <input
                    type="tel"
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    placeholder="+91 98450 12890"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs sm:text-sm font-mono text-[#f5f3eb] focus:outline-none focus:border-[#fae69e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1">
                      {t('auth.newPin', 'New PIN')} *
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      value={resetNewPin}
                      onChange={(e) => setResetNewPin(e.target.value)}
                      placeholder="••••"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs sm:text-sm font-mono text-[#f5f3eb] focus:outline-none focus:border-[#fae69e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1">
                      {t('auth.confirmPin', 'Confirm PIN')} *
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      value={resetConfirmPin}
                      onChange={(e) => setResetConfirmPin(e.target.value)}
                      placeholder="••••"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs sm:text-sm font-mono text-[#f5f3eb] focus:outline-none focus:border-[#fae69e]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotPinOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs font-mono text-[#aba79c] hover:text-[#fae69e] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer disabled:opacity-50"
                  >
                    {isResetting ? 'Resetting...' : t('auth.resetPinBtn', 'Update PIN')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
