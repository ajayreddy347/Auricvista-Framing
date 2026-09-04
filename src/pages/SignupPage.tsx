import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Wheat,
  KeyRound,
  Hash,
  Copy,
  Check,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Footer } from '../components/Footer';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, farmerRegister, isLoggedIn, userRole: currentRole } = useAuth();
  const { t } = useLanguage();

  // Pre-select role if URL has ?role=farmer or ?role=customer
  const initialRoleParam = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    initialRoleParam === 'farmer' || initialRoleParam === 'customer'
      ? (initialRoleParam as UserRole)
      : null
  );

  // Common form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Farmer specific registration fields
  const [farmLocation, setFarmLocation] = useState('');
  const [farmName, setFarmName] = useState('');
  const [mainCrops, setMainCrops] = useState('');
  const [farmerPin, setFarmerPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Customer specific registration fields
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Post-Registration Success Modal (for Farmer ID reveal)
  const [registeredFarmerId, setRegisteredFarmerId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in (unless just registered and viewing Farmer ID)
  useEffect(() => {
    if (isLoggedIn && currentRole && !registeredFarmerId) {
      navigate(currentRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard', { replace: true });
    }
  }, [isLoggedIn, currentRole, registeredFarmerId, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
  };

  const handleSwitchRole = () => {
    setSelectedRole(null);
    setErrorMessage('');
    setRegisteredFarmerId(null);
  };

  const handleCopyFarmerId = () => {
    if (!registeredFarmerId) return;
    navigator.clipboard.writeText(registeredFarmerId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedRole) {
      setErrorMessage('Please choose your account profile.');
      return;
    }

    setIsLoading(true);

    try {
      if (selectedRole === 'farmer') {
        // Validation for Farmer registration
        if (!fullName.trim() || !phone.trim() || !farmLocation.trim() || !farmName.trim() || !mainCrops.trim()) {
          setIsLoading(false);
          setErrorMessage('Please fill in all mandatory farmer registration fields.');
          return;
        }

        if (farmerPin.length < 4) {
          setIsLoading(false);
          setErrorMessage('Security PIN must be at least 4 digits.');
          return;
        }

        if (farmerPin !== confirmPin) {
          setIsLoading(false);
          setErrorMessage('Security PIN and Confirm PIN do not match.');
          return;
        }

        const res = await farmerRegister({
          name: fullName.trim(),
          phone: phone.trim(),
          location: farmLocation.trim(),
          farmName: farmName.trim(),
          mainCrops: mainCrops.trim(),
          pin: farmerPin.trim(),
          email: email.trim() || undefined,
        });

        setIsLoading(false);
        // Show prominent Farmer ID display modal
        setRegisteredFarmerId(res.farmerId);
      } else {
        // Customer Registration
        if (!fullName.trim() || !email.trim() || !password || !phone.trim()) {
          setIsLoading(false);
          setErrorMessage('Please fill in all mandatory fields.');
          return;
        }

        if (password.length < 6) {
          setIsLoading(false);
          setErrorMessage('Password must be at least 6 characters.');
          return;
        }

        const userProfile = await signup({
          name: fullName.trim(),
          email: email.trim(),
          password,
          role: 'customer',
          phone: phone.trim(),
          location: deliveryAddress.trim() || 'Bengaluru',
          address: deliveryAddress.trim() || 'Indiranagar, Bengaluru',
        });

        setIsLoading(false);
        navigate('/customer-dashboard');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Registration failed. Please check your data.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col justify-between bg-transparent text-[#f5f3eb] font-sans">
      {/* Background ambient radial gold aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full gold-ambient-radial blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto w-full px-4 sm:px-6 my-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/35 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.2)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
              {t('auth.signupSubtitle', 'Direct Agricultural Network')}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#fcfbf7]">
            {t('auth.signupTitle', 'Create Your Auric Arohi Account')}
          </h1>
          <p className="text-xs sm:text-sm text-[#aba79c] mt-2 max-w-md mx-auto">
            Direct farmer-to-consumer agricultural network. Zero middleman overhead.
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-3xl bg-[#0e0d0b]/90 border border-[#d4af37]/35 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.2)]">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              /* STEP 1: CHOOSE PROFILE */
              <motion.div
                key="role-cards"
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
                    Select how you wish to register with Auric Arohi:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Farmer Option */}
                  <div
                    id="signup-select-farmer-btn"
                    onClick={() => handleRoleSelect('farmer')}
                    className="p-5 rounded-2xl bg-[#14120e] hover:bg-[#1c180e] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#262010] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] mb-4 shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)]">
                        <Tractor className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
                          {t('auth.asFarmer', 'Verified Farmer')}
                        </h3>
                        <span className="text-[9px] font-mono text-[#34d399] bg-[#122818] px-1.5 py-0.5 rounded border border-[#34d399]/30">
                          ID + PIN
                        </span>
                      </div>
                      <p className="text-xs text-[#aba79c] leading-relaxed">
                        Register with mobile & PIN. Receive a unique Farmer ID for effortless direct access.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-xs font-mono text-[#d4af37]">
                      <span>Grower Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Customer Option */}
                  <div
                    id="signup-select-customer-btn"
                    onClick={() => handleRoleSelect('customer')}
                    className="p-5 rounded-2xl bg-[#14120e] hover:bg-[#1c180e] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#262010] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] mb-4 shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)]">
                        <User className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
                        {t('auth.asCustomer', 'Direct Patron')}
                      </h3>
                      <p className="text-xs text-[#aba79c] mt-1 leading-relaxed">
                        Order ultra-fresh harvest directly from certified regional farms.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-xs font-mono text-[#d4af37]">
                      <span>Patron Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-xs text-[#8e8b82]">
                    {t('auth.hasAccount', 'Already registered?')}{' '}
                    <Link
                      to="/login"
                      className="text-[#fae69e] hover:underline font-semibold font-mono uppercase tracking-wider ml-1"
                    >
                      {t('auth.loginBtn', 'Sign In')}
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* STEP 2: REGISTRATION FORM */
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4af37]/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#1a1710] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e]">
                      {selectedRole === 'farmer' ? <Tractor className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#fcfbf7] leading-tight">
                        {selectedRole === 'farmer'
                          ? t('auth.asFarmer', 'Register as Verified Farmer')
                          : t('auth.asCustomer', 'Register as Patron')}
                      </h2>
                      <span className="text-[11px] font-mono text-[#c9a227] uppercase tracking-wider">
                        Profile: {selectedRole === 'farmer' ? 'Farmer ID + PIN System' : 'Customer Account'}
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

                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-[#2a1010] border border-[#f87171]/50 text-[#fca5a5] text-xs flex items-center gap-2.5 font-sans">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedRole === 'farmer' ? (
                    /* ---------------------------------------------------- */
                    /* FARMER REGISTRATION FLOW                            */
                    /* ---------------------------------------------------- */
                    <>
                      {/* Farmer Name */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                          {t('auth.fullName', 'Farmer Full Name')} *
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ramesh Gowda"
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                        />
                      </div>

                      {/* Mobile Number & Optional Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                            {t('checkout.phone', 'Mobile Number')} *
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98450 12890"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm font-mono text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37]">
                              {t('auth.email', 'Email Address')}
                            </label>
                            <span className="text-[10px] font-mono text-[#8e8b82]">
                              ({t('auth.optional', 'Optional')})
                            </span>
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ramesh@auricvista.farm"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                          />
                        </div>
                      </div>

                      {/* Farm Name & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                            {t('auth.farmName', 'Farm / Estate Name')} *
                          </label>
                          <input
                            type="text"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                            placeholder="e.g. Gowda Heritage Organic Farm"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                            {t('auth.location', 'Farm / Village Location')} *
                          </label>
                          <input
                            type="text"
                            value={farmLocation}
                            onChange={(e) => setFarmLocation(e.target.value)}
                            placeholder="e.g. Mandya Valley, Karnataka"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                          />
                        </div>
                      </div>

                      {/* Main Crops */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                          {t('auth.mainCrops', 'Main Crops Cultivated')} *
                        </label>
                        <input
                          type="text"
                          value={mainCrops}
                          onChange={(e) => setMainCrops(e.target.value)}
                          placeholder="e.g. Heirloom Vine Tomatoes, Baby Spinach, Golden Carrots"
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                        />
                      </div>

                      {/* PIN & Confirm PIN */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                            {t('auth.farmerPin', 'Set Security PIN')} * (4-6 digits)
                          </label>
                          <div className="relative">
                            <input
                              type={showPin ? 'text' : 'password'}
                              inputMode="numeric"
                              maxLength={6}
                              value={farmerPin}
                              onChange={(e) => setFarmerPin(e.target.value)}
                              placeholder="••••"
                              required
                              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm font-mono tracking-widest text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPin(!showPin)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8e8b82] hover:text-[#fae69e]"
                            >
                              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                            {t('auth.confirmPin', 'Confirm PIN')} *
                          </label>
                          <input
                            type={showPin ? 'text' : 'password'}
                            inputMode="numeric"
                            maxLength={6}
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            placeholder="••••"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm font-mono tracking-widest text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ---------------------------------------------------- */
                    /* CUSTOMER REGISTRATION FLOW                          */
                    /* ---------------------------------------------------- */
                    <>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                          {t('auth.fullName', 'Full Name')} *
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ananya Sharma"
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                            {t('checkout.phone', 'Phone Number')} *
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98450 12890"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm font-mono text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                            {t('auth.email', 'Email Address')} *
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ananya@auricvista.farm"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                          {t('auth.password', 'Password')} *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            required
                            className="w-full px-4 py-2.5 pr-11 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
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

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                          {t('checkout.address', 'Default Delivery Address')}
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g. Flat 402, Green Meadows, Indiranagar, Bengaluru"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#f5f3eb] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_25px_-5px_rgba(212,175,55,0.45)] hover:shadow-[0_0_35px_0_rgba(212,175,55,0.6)] active:scale-[0.99] transition-all duration-300 cursor-pointer disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>
                            {selectedRole === 'farmer'
                              ? t('auth.farmerSignupBtn', 'Register & Generate Farmer ID')
                              : t('auth.signupBtn', 'Create Account')}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-5 border-t border-[#d4af37]/20 text-center">
                  <p className="text-xs text-[#8e8b82]">
                    {t('auth.hasAccount', 'Already registered?')}{' '}
                    <Link
                      to="/login"
                      className="text-[#fae69e] hover:underline font-semibold font-mono uppercase tracking-wider ml-1"
                    >
                      {t('auth.loginBtn', 'Sign In')}
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PROMINENT FARMER ID CREATION MODAL                                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {registeredFarmerId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg rounded-3xl bg-[#0e0d0b] border-2 border-[#d4af37] p-6 sm:p-8 shadow-[0_0_60px_rgba(212,175,55,0.4)] text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2a2210] to-[#14120c] border-2 border-[#d4af37] flex items-center justify-center text-[#fae69e] mx-auto shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                <CheckCircle2 className="w-9 h-9 text-[#34d399]" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] block mb-1">
                  Farmer Registration Verified
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fcfbf7]">
                  {t('auth.farmerIdCreated', 'Your Unique Farmer ID')}
                </h2>
                <p className="text-xs text-[#aba79c] mt-2 max-w-sm mx-auto">
                  {t(
                    'auth.farmerIdInstructions',
                    'Save your Farmer ID securely! You will use this ID along with your security PIN to access the farmer portal.'
                  )}
                </p>
              </div>

              {/* Farmer ID Display Pill */}
              <div className="p-4 rounded-2xl bg-[#14120e] border-2 border-[#d4af37]/60 flex items-center justify-between gap-3 shadow-inner">
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e8b82] block">
                    Permanent Farmer ID
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-[#fae69e]">
                    {registeredFarmerId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyFarmerId}
                  className="px-4 py-2.5 rounded-xl bg-[#262010] border border-[#d4af37]/50 text-[#fae69e] text-xs font-mono font-medium hover:bg-[#332b16] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-[#34d399]" />
                      <span className="text-[#34d399]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Proceed */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/farmer-dashboard')}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_35px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('auth.goToDashboard', 'Proceed to Farmer Dashboard')}</span>
                  <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
