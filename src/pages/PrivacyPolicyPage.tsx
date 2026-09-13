import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-transparent text-[#fcfbf7] pt-20 flex flex-col justify-between font-sans"
    >
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#fae69e] hover:text-[#ffffff] uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="mb-10 pb-8 border-b border-[#d4af37]/25">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/35 shadow-sm mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
              Legal & Privacy Protocol
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#fcfbf7] mb-3">
            AuricVista Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#aba79c]">
            Last updated: September 2026 • Platform Version: AuricVista Production Network
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-sm sm:text-base text-[#d0cbc0] leading-relaxed font-sans">
          {/* Section 1: Overview */}
          <section className="p-6 sm:p-7 rounded-2xl bg-[#0e0d0b]/90 border border-[#d4af37]/25 backdrop-blur-xl">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#fae69e] mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d4af37]" />
              <span>1. Overview & Commitment</span>
            </h2>
            <p>
              Welcome to AuricVista. We are committed to safeguarding the personal privacy of both our conscious consumers and certified Indian agricultural producers. This Privacy Policy outlines how AuricVista collects, protects, utilizes, and manages personal identification, location information, and financial transaction records across all AuricVista web interfaces and applications.
            </p>
          </section>

          {/* Section 2: Information Collection */}
          <section className="p-6 sm:p-7 rounded-2xl bg-[#0e0d0b]/90 border border-[#d4af37]/25 backdrop-blur-xl">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#fae69e] mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#d4af37]" />
              <span>2. Information We Collect</span>
            </h2>
            <p className="mb-3">
              When creating an account or placing orders through AuricVista, we collect information necessary to fulfill our farm-to-doorstep pledge:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2 text-[#aba79c]">
              <li>
                <strong className="text-[#fcfbf7]">Customer Details:</strong> Name, verified email address, phone number, and delivery address for order dispatch.
              </li>
              <li>
                <strong className="text-[#fcfbf7]">Farmer Registration:</strong> Farm name, state/district geolocation, cultivated produce details, contact credentials, and unique AuricVista Farmer ID.
              </li>
              <li>
                <strong className="text-[#fcfbf7]">Order & Transaction Data:</strong> Cart selections, delivery preferences, invoice amounts, and order statuses.
              </li>
            </ul>
          </section>

          {/* Section 3: Data Usage */}
          <section className="p-6 sm:p-7 rounded-2xl bg-[#0e0d0b]/90 border border-[#d4af37]/25 backdrop-blur-xl">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#fae69e] mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#d4af37]" />
              <span>3. How AuricVista Uses Your Information</span>
            </h2>
            <p className="mb-3">
              AuricVista uses collected data solely for transparent marketplace operations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2 text-[#aba79c]">
              <li>Connecting consumers directly with certified regional growers across Indian states.</li>
              <li>Coordinating cold-transit logistics from farm dawn harvests to household delivery.</li>
              <li>Providing AI-assisted crop quality verification and automated customer ratings.</li>
              <li>Ensuring 100% direct escrow payouts with zero intermediary commission cuts.</li>
            </ul>
          </section>

          {/* Section 4: Data Protection & Security */}
          <section className="p-6 sm:p-7 rounded-2xl bg-[#0e0d0b]/90 border border-[#d4af37]/25 backdrop-blur-xl">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#fae69e] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
              <span>4. Data Security & Storage</span>
            </h2>
            <p>
              AuricVista implements enterprise-grade database encryption and strict token-based authentication protocols. All sensitive authentication tokens and security PINs are hashed using cryptographic salt methods before storage in secure PostgreSQL instances. AuricVista never sells, rents, or licenses your personal data to third-party marketing brokers.
            </p>
          </section>

          {/* Section 5: Contact Information */}
          <section className="p-6 sm:p-7 rounded-2xl bg-[#0e0d0b]/90 border border-[#d4af37]/25 backdrop-blur-xl">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#fae69e] mb-3">
              5. Contacting AuricVista Privacy Officers
            </h2>
            <p className="text-xs sm:text-sm text-[#aba79c]">
              For inquiries regarding personal data retention, account deletion, or privacy verification under Indian IT regulations, please contact the AuricVista Data Protection Team at{' '}
              <a href="mailto:privacy@auricvista.farm" className="text-[#fae69e] hover:underline font-mono">
                privacy@auricvista.farm
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};
