import React from 'react';
import { Wheat, ShieldCheck, Globe, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../translations';

export const Footer: React.FC = () => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();

  return (
    <footer id="auricarohi-footer" className="relative w-full border-t border-[#d4af37]/25 bg-[#0c0b09] text-[#aba79c] pt-16 pb-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#d4af37]/20">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 group">
                <img
                  src="/assets/logo/auric-arohi-logo.png"
                  alt="Auric Arohi Logo"
                  className="h-12 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:scale-105 transition-transform"
                />
                <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors uppercase">
                  {t('nav.brand', 'AURIC AROHI')}
                </span>
              </Link>
              <p className="mt-3 text-xs font-mono tracking-wider text-[#d4af37] uppercase font-semibold">
                {t('nav.tagline', 'Fresh From Farmers. Direct To You.')}
              </p>
              <p className="mt-4 text-xs text-[#aba79c] leading-relaxed max-w-md font-sans">
                {t(
                  'footer.mission',
                  'India\'s direct agricultural marketplace connecting local certified growers with conscious consumers. Eliminating middleman markups and delivering morning-fresh organic harvests.'
                )}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#fae69e]">
              <ShieldCheck className="w-4 h-4 text-[#34d399]" />
              <span>{t('footer.directGuarantee', 'Direct Farmer-to-Consumer Exchange Protocol')}</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#fcfbf7] font-bold mb-4">
              {t('footer.quickLinks', 'Quick Links')}
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link to="/marketplace" className="text-[#aba79c] hover:text-[#fae69e] transition-colors">
                  {t('nav.marketplace', 'Marketplace')}
                </Link>
              </li>
              <li>
                <Link to="/signup?role=farmer" className="text-[#aba79c] hover:text-[#fae69e] transition-colors">
                  {t('footer.becomeFarmer', 'Become a Farmer')}
                </Link>
              </li>
              <li>
                <a href="#about-auric-arohi" className="text-[#aba79c] hover:text-[#fae69e] transition-colors">
                  {t('footer.about', 'About Auric Arohi')}
                </a>
              </li>
              <li>
                <Link to="/farmers" className="text-[#aba79c] hover:text-[#fae69e] transition-colors">
                  {t('nav.farmers', 'Farmer Network')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Languages Column */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#fcfbf7] font-bold mb-4 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{t('nav.language', 'Select Language')}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {supportedLanguages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code as LanguageCode)}
                  className={`p-2 rounded-xl text-left text-xs font-sans flex items-center justify-between border transition-all cursor-pointer ${
                    language === l.code
                      ? 'bg-[#261f12] border-[#fae69e] text-[#fae69e] font-bold shadow-sm'
                      : 'bg-[#181510] border-[#d4af37]/20 text-[#aba79c] hover:text-[#fcfbf7] hover:border-[#d4af37]/45'
                  }`}
                >
                  <span className="truncate">{l.nativeName}</span>
                  {language === l.code && <Check className="w-3.5 h-3.5 text-[#34d399]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center">
          <p className="text-xs font-mono text-[#8e8b82]">
            {t('common.footerText', 'Auric Arohi © 2026. Certified regenerative and natural agriculture.')}
          </p>
        </div>
      </div>
    </footer>
  );
};
