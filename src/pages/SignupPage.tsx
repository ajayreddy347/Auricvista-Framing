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
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Footer } from '../components/Footer';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, isLoggedIn, userRole: currentRole } = useAuth();

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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Farmer specific fields
  const [farmLocation, setFarmLocation] = useState('');
  const [farmName, setFarmName] = useState('');

  // Customer specific fields
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && currentRole) {
      navigate(currentRole === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard', { replace: true });
    }
  }, [isLoggedIn, currentRole, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
  };

  const handleSwitchRole = () => {
    setSelectedRole(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedRole) {
      setErrorMessage('Please select whether you want to join as a Farmer or Customer.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (selectedRole === 'farmer' && !farmLocation.trim()) {
      setErrorMessage('Please enter your farm location (district/city/zone).');
      return;
    }

    if (selectedRole === 'customer' && !deliveryAddress.trim()) {
      setErrorMessage('Please enter your delivery address / city.');
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await signup({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole,
        phone: phone.trim(),
        location: selectedRole === 'farmer' ? farmLocation.trim() : deliveryAddress.trim(),
        farmName: selectedRole === 'farmer' && farmName.trim() ? farmName.trim() : undefined,
        address: selectedRole === 'customer' ? deliveryAddress.trim() : undefined,
      });

      navigate(newUser.role === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
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
              JOIN THE DIRECT FARM MOVEMENT
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#fcfbf7]">
            Create an Account
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#aba79c] font-sans">
            Choose your role to get customized direct pricing and transparent farm traceability.
          </p>
        </div>

        {/* ======================================================================= */}
        {/* INTERACTIVE ROLE SELECTION OR SIGNUP FORM                               */}
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
                    Select Account Type
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Card 1: Farmer */}
                  <div
                    id="signup-role-farmer-card"
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
                        Sell morning harvests at 100% fair producer value. Zero middlemen commissions, automated logistics & fast payments.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between text-xs font-mono text-[#d4af37]">
                      <span>Farmer Onboarding</span>
                      <span className="font-bold uppercase tracking-wider">Register →</span>
                    </div>
                  </div>

                  {/* Card 2: Customer */}
                  <div
                    id="signup-role-customer-card"
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
                        Order ultra-fresh produce directly from local regenerative farms. Enjoy weekly farm baskets and QR traceability.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between text-xs font-mono text-[#d4af37]">
                      <span>Consumer Account</span>
                      <span className="font-bold uppercase tracking-wider">Register →</span>
                    </div>
                  </div>
                </div>

                {/* Bottom link to Login */}
                <div className="text-center pt-6">
                  <p className="text-xs text-[#8e8b82]">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-[#fae69e] hover:underline font-semibold font-mono uppercase tracking-wider ml-1"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ================================================================= */
              /* STEP 2: ROLE-SPECIFIC SIGNUP FORM                                 */
              /* ================================================================= */
              <motion.div
                key="signup-form"
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
                          ? 'Register as Producer Farmer'
                          : 'Register as Customer'}
                      </h2>
                      <span className="text-[11px] font-mono text-[#c9a227] uppercase tracking-wider">
                        {selectedRole === 'farmer'
                          ? 'Direct farm gate settlement'
                          : 'Farm-to-doorstep direct'}
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

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-[#2a1010] border border-[#f87171]/50 text-[#fca5a5] text-xs flex items-center gap-2.5 font-sans">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={selectedRole === 'farmer' ? 'e.g. Ramesh Gowda' : 'e.g. Ananya Sharma'}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="signup-phone"
                        className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5"
                      >
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="signup-email"
                        className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@email.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5"
                    >
                      Create Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
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

                  {/* ROLE SPECIFIC FIELDS */}
                  {selectedRole === 'farmer' ? (
                    <>
                      {/* Farm Location */}
                      <div>
                        <label
                          htmlFor="signup-farm-location"
                          className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5"
                        >
                          Farm Location (City / District / Zone) *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <input
                            id="signup-farm-location"
                            type="text"
                            value={farmLocation}
                            onChange={(e) => setFarmLocation(e.target.value)}
                            placeholder="e.g. Chikkaballapur Valley, Karnataka"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                          />
                        </div>
                      </div>

                      {/* Farm Name (Optional) */}
                      <div>
                        <label
                          htmlFor="signup-farm-name"
                          className="block text-xs font-mono uppercase tracking-wider text-[#aba79c] mb-1.5"
                        >
                          Farm Name <span className="text-[10px] text-[#8e8b82] lowercase">(optional)</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                            <Building className="w-4 h-4" />
                          </div>
                          <input
                            id="signup-farm-name"
                            type="text"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                            placeholder="e.g. Gowda Regenerative Organic Estate"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Customer Delivery Address */
                    <div>
                      <label
                        htmlFor="signup-delivery-address"
                        className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5"
                      >
                        Delivery Address / City *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8b82]">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-delivery-address"
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g. 42 Palm Grove Ave, Indiranagar, Bengaluru"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] transition-all font-sans"
                        />
                      </div>
                    </div>
                  )}

                  {/* Trust & Guarantee Note */}
                  <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#8e8b82]">
                    <ShieldCheck className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>Protected under AuricVista Zero-Intermediary Escrow Protocol</span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      id="signup-submit-btn"
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_25px_-5px_rgba(212,175,55,0.45)] hover:shadow-[0_0_35px_0_rgba(212,175,55,0.6)] active:scale-[0.99] transition-all duration-300 cursor-pointer disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>CREATE {selectedRole.toUpperCase()} ACCOUNT</span>
                          <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer Switch to Sign In */}
                <div className="mt-6 pt-5 border-t border-[#d4af37]/20 text-center">
                  <p className="text-xs text-[#8e8b82]">
                    Already registered?{' '}
                    <Link
                      to={`/login?role=${selectedRole}`}
                      className="text-[#fae69e] hover:underline font-semibold font-mono uppercase tracking-wider ml-1"
                    >
                      Sign in here
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
