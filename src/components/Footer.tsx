import React from 'react';
import { Wheat, ShieldCheck, Globe, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageCode } from '../translations';

export const Footer: React.FC = () => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const { isDark } = useTheme();

  return (
    <footer
      id="auricarohi-footer"
      className={`relative w-full border-t pt-16 pb-12 px-4 sm:px-6 lg:px-12 transition-colors duration-300 ${
        isDark
          ? 'bg-[#0c0b09] border-[#d4af37]/25 text-[#aba79c]'
          : 'bg-[#faf8f5] border-[#e7e4dc] text-[#57534e]'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b ${
          isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'
        }`}>
          {/* Brand & Mission Column */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col justify-between space-y-5">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 group">
                <img
                  src="/assets/logo/auric-arohi-logo.png"
                  alt="Auric Arohi Logo"
                  className="h-11 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:scale-105 transition-transform"
                />
                <span className={`font-serif text-2xl font-bold tracking-[0.18em] transition-colors uppercase ${
                  isDark ? 'text-[#fcfbf7] group-hover:text-[#fae69e]' : 'text-[#1c1917] group-hover:text-[#8f6208]'
                }`}>
                  {t('nav.brand', 'AURIC AROHI')}
                </span>
              </Link>
              <p className={`mt-2 text-xs font-mono tracking-wider uppercase font-semibold ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`}>
                {t('nav.tagline', 'Direct From the Farm')}
              </p>
              <p className={`mt-3 text-xs leading-relaxed max-w-sm font-sans ${
                isDark ? 'text-[#aba79c]' : 'text-[#57534e]'
              }`}>
                {t(
                  'footer.mission',
                  "India's direct agricultural marketplace connecting certified growers with conscious consumers. Eliminating middleman markups and delivering dawn-harvested organic produce."
                )}
              </p>
            </div>

            <div className={`flex items-center gap-2 text-xs font-mono pt-2 ${
              isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
            }`}>
              <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>{t('footer.directGuarantee', 'Direct Farmer-to-Consumer Exchange Protocol')}</span>
            </div>
          </div>

          {/* Column 2: Marketplace */}
          <div className="lg:col-span-2">
            <h4 className={`text-xs font-mono uppercase tracking-[0.2em] font-bold mb-4 ${
              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
            }`}>
              {t('nav.marketplace', 'Marketplace')}
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link to="/marketplace" className={`transition-colors ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  {t('featured.eyebrow', 'Fresh Produce')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className={`transition-colors ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  {t('nav.howItWorks', 'How It Works')}
                </Link>
              </li>
              <li>
                <Link to="/avani" className={`transition-colors flex items-center gap-1.5 ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  <span>Auric Avani</span>
                </Link>
              </li>
              <li>
                <Link to="/impact" className={`transition-colors ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  {t('nav.impact', 'Direct Impact')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={`transition-colors ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Farmers & Growers */}
          <div className="lg:col-span-2">
            <h4 className={`text-xs font-mono uppercase tracking-[0.2em] font-bold mb-4 ${
              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
            }`}>
              {t('nav.farmers', 'Grower Network')}
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link to="/farmers" className={`transition-colors ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  {t('farmer.eyebrow', 'Verified Farmers')}
                </Link>
              </li>
              <li>
                <Link to="/signup?role=farmer" className={`transition-colors ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  {t('footer.becomeFarmer', 'Become a Farmer')}
                </Link>
              </li>
              <li>
                <Link to="/farmer-dashboard" className={`transition-colors ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  {t('dash.farmerTitle', 'Farmer Portal')}
                </Link>
              </li>
              <li>
                <Link to="/customer-dashboard" className={`transition-colors ${
                  isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#57534e] hover:text-[#8f6208]'
                }`}>
                  {t('dash.customerTitle', 'Patron Portal')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Regional Languages */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h4 className={`text-xs font-mono uppercase tracking-[0.2em] font-bold mb-3.5 flex items-center gap-2 ${
              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
            }`}>
              <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
              <span>{t('nav.language', 'Select Language')} ({supportedLanguages.length})</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {supportedLanguages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code as LanguageCode)}
                  className={`p-2 rounded-xl text-left text-xs font-sans flex items-center justify-between border transition-all cursor-pointer ${
                    language === l.code
                      ? isDark
                        ? 'bg-[#261f12] border-[#fae69e] text-[#fae69e] font-bold shadow-xs'
                        : 'bg-[#fbf9f4] border-[#b89120] text-[#8f6208] font-bold shadow-xs'
                      : isDark
                      ? 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c] hover:text-[#fcfbf7] hover:border-[#d4af37]/45'
                      : 'bg-white border-[#e7e4dc] text-[#57534e] hover:text-[#1c1917] hover:border-[#b89120]'
                  }`}
                >
                  <span className="truncate">{l.nativeName}</span>
                  {language === l.code && <Check className="w-3 h-3 text-[#16a34a] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className={`text-xs font-mono ${isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}`}>
            {t('common.footerText', 'AuricVista © 2026. Certified organic and natural direct agricultural trade.')}
          </p>
          <p className={`text-[11px] font-mono ${isDark ? 'text-[#736f66]' : 'text-[#a8a29e]'}`}>
            100% Direct Farm-to-Consumer Protocol Active
          </p>
        </div>
      </div>
    </footer>
  );
};
