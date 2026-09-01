import React from 'react';
import {
  Wheat,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const footerLinks = {
    marketplace: [
      { name: 'Vegetables', href: '/marketplace' },
      { name: 'Fruits', href: '/marketplace' },
      { name: 'Grains & Millets', href: '/marketplace' },
      { name: 'Dairy & Farm Eggs', href: '/marketplace' },
      { name: 'Seasonal Baskets', href: '/marketplace' },
    ],
    company: [
      { name: 'About AuricVista', href: '/how-it-works' },
      { name: 'Farmer Impact Story', href: '/impact' },
      { name: 'Traceability Standard', href: '/farmers' },
      { name: 'Our Farmers', href: '/farmers' },
      { name: 'Trust & Verification', href: '/trust' },
    ],
    support: [
      { name: 'Help Center', href: '/trust' },
      { name: 'Farmer Dashboard', href: '/farmer-dashboard' },
      { name: 'Customer Portal', href: '/customer-dashboard' },
      { name: 'Report an Issue', href: '/trust' },
      { name: 'Terms of Direct Sale', href: '/trust' },
    ],
  };

  return (
    <footer id="auricvista-footer" className="relative w-full border-t border-[#d4af37]/25 bg-[#050505] text-[#aba79c] pt-16 pb-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#d4af37]/15">
          {/* Left: Logo Wordmark + Tagline */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-[#1d1910] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] group-hover:scale-105 transition-transform shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)]">
                  <Wheat className="w-5 h-5" />
                </div>
                <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors uppercase">
                  AURICVISTA
                </span>
              </Link>
              <p className="mt-3 text-sm text-[#8e8b82] font-mono tracking-wider">
                Direct From the Farm.
              </p>
              <p className="mt-4 text-xs text-[#6e6b63] leading-relaxed max-w-sm font-sans">
                The direct agricultural exchange uniting regenerative regional growers with conscious consumers, restaurants, and wholesale institutions.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#c9a227]">
              <ShieldCheck className="w-4 h-4 text-[#34d399]" />
              <span>Zero-Intermediary Guarantee</span>
            </div>
          </div>

          {/* Middle: Simple Link Columns */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Marketplace Column */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f5f3eb] font-semibold mb-4">
                Marketplace
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                {footerLinks.marketplace.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.href}
                      className="text-[#9e9b92] hover:text-[#fae69e] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f5f3eb] font-semibold mb-4">
                Company
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                {footerLinks.company.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.href}
                      className="text-[#9e9b92] hover:text-[#fae69e] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f5f3eb] font-semibold mb-4">
                Support
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                {footerLinks.support.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.href}
                      className="text-[#9e9b92] hover:text-[#fae69e] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Social Icon Placeholders */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f5f3eb] font-semibold mb-4">
                Connect
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-[#fae69e] hover:border-[#fae69e] transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#twitter"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-lg bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-[#fae69e] hover:border-[#fae69e] transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#linkedin"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-[#fae69e] hover:border-[#fae69e] transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-[#fae69e] hover:border-[#fae69e] transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-[11px] font-mono text-[#6e6b63] block mb-1">
                HQ: Bengaluru, Karnataka
              </span>
              <span className="text-[10px] font-mono text-[#c9a227]">
                agri-network@auricvista.com
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Line, Small Gray Text, Centered */}
        <div className="pt-8 text-center">
          <p className="text-xs font-mono text-[#66635a]">
            © 2026 AuricVista. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
