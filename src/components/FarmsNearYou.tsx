import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export interface FarmNearbyPin {
  id: number;
  name: string;
  distance: string;
  location: string;
  lat: number;
  lng: number;
  products: string[];
  harvest: string;
  badge: string;
}

export const FarmsNearYou: React.FC = () => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activePin, setActivePin] = useState<number>(0);
  const [googleMapsReady, setGoogleMapsReady] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const googleMapsKey =
    typeof import.meta !== 'undefined' && (import.meta as any).env
      ? (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY
      : '';

  const pins: FarmNearbyPin[] = [
    {
      id: 0,
      name: 'Ravi Kumar',
      distance: '2.4 km away',
      location: 'Chikkaballapur Valley, Karnataka',
      lat: 13.4355,
      lng: 77.7315,
      products: ['Tomatoes', 'Bell Peppers', 'Spinach'],
      harvest: "Today's Harvest: 6:00 AM",
      badge: 'Pickup Available',
    },
    {
      id: 1,
      name: 'Lakshmi Devi',
      distance: '4.8 km away',
      location: 'Kolar Organic Belt, Karnataka',
      lat: 13.1367,
      lng: 78.1291,
      products: ['Hydroponic Greens', 'Melons'],
      harvest: "Today's Harvest: 5:30 AM",
      badge: 'Pickup Available',
    },
    {
      id: 2,
      name: 'Suresh Naidu',
      distance: '6.2 km away',
      location: 'Hosur Agro Ridge, Tamil Nadu',
      lat: 12.7409,
      lng: 77.8253,
      products: ['Heritage Millets', 'Desi Milk'],
      harvest: "Today's Harvest: 6:30 AM",
      badge: 'Cold Dispatch Hub',
    },
    {
      id: 3,
      name: 'Anand Gowda',
      distance: '3.1 km away',
      location: 'Devanahalli Groves, Karnataka',
      lat: 13.2500,
      lng: 77.7100,
      products: ['Guavas', 'Papayas', 'Herbs'],
      harvest: "Today's Harvest: 7:00 AM",
      badge: 'Pickup Available',
    },
  ];

  const currentFarm = pins[activePin];

  // 1. Google Maps JS API script injection (if key provided or if already available in window)
  useEffect(() => {
    if ((window as any).google?.maps) {
      setGoogleMapsReady(true);
      return;
    }

    if (!googleMapsKey) {
      setGoogleMapsReady(false);
      return;
    }

    const scriptId = 'auric-google-maps-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsReady(true);
      script.onerror = () => setGoogleMapsReady(false);
      document.head.appendChild(script);
    } else {
      script.onload = () => setGoogleMapsReady(true);
    }
  }, [googleMapsKey]);

  // 2. Initialize and update Google Map instance when ready
  useEffect(() => {
    if (!googleMapsReady || !mapRef.current || !(window as any).google?.maps) return;

    try {
      const google = (window as any).google;
      const googleMaps = google.maps;

      const darkMapStyle = [
        { elementType: 'geometry', stylers: [{ color: '#0b0a08' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0b0a08' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#fae69e' }] },
        { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d4af37' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8e8b82' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#141c10' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1c1912' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#2b2313' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#05070a' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3b82f6' }] },
      ];

      if (!mapInstance.current) {
        mapInstance.current = new googleMaps.Map(mapRef.current, {
          center: { lat: currentFarm.lat, lng: currentFarm.lng },
          zoom: 10,
          styles: isDark ? darkMapStyle : [], // In Light Mode: Google normal LIGHT map appearance
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
      } else {
        mapInstance.current.setOptions({
          styles: isDark ? darkMapStyle : [],
        });
      }

      // Clear existing markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Add real markers for all 4 farms
      pins.forEach((pin, idx) => {
        const isSelected = activePin === idx;
        const marker = new googleMaps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map: mapInstance.current,
          title: `${pin.name} - ${pin.location}`,
          icon: {
            path: googleMaps.SymbolPath.CIRCLE,
            scale: isSelected ? 12 : 8,
            fillColor: isSelected ? '#d4af37' : isDark ? '#fae69e' : '#b8860b',
            fillOpacity: 1,
            strokeColor: isDark ? '#0a0a0a' : '#ffffff',
            strokeWeight: 2.5,
          },
        });

        marker.addListener('click', () => {
          setActivePin(idx);
          mapInstance.current.panTo({ lat: pin.lat, lng: pin.lng });
        });

        markersRef.current.push(marker);
      });

      // Pan to active pin
      mapInstance.current.panTo({ lat: currentFarm.lat, lng: currentFarm.lng });
    } catch (err) {
      console.error('Error with Google Maps in FarmsNearYou:', err);
    }
  }, [googleMapsReady, isDark, activePin]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${currentFarm.name}, ${currentFarm.location}`
  )}`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${currentFarm.name}, ${currentFarm.location}`
  )}&travelmode=driving`;

  const googleEmbedUrl = `https://maps.google.com/maps?q=${currentFarm.lat},${currentFarm.lng}&hl=en&z=11&output=embed`;

  return (
    <section
      id="farms-near-you-section"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden ${
        isDark ? 'bg-transparent border-t border-[#d4af37]/15' : 'bg-[#faf8f5] border-t border-stone-200'
      } backdrop-blur-[2px]`}
    >
      {/* Ambient background gold glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full blur-3xl ${
          isDark ? 'gold-ambient-secondary opacity-35' : 'bg-[radial-gradient(ellipse,rgba(212,175,55,0.07)_0%,transparent_70%)]'
        }`} />
        <div className={`absolute inset-0 bg-subtle-grid mask-gradient ${isDark ? 'opacity-30' : 'opacity-10'}`} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* SECTION HEADER & TITLE */}
        {/* ========================================================================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={itemFadeUp} className="mb-5 inline-block">
            <div
              id="farms-eyebrow-pill"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-[#14120c]/80 border border-[#d4af37]/30 text-[#e8dfca] shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]'
                  : 'bg-white border border-[#d4af37]/50 text-[#8f6208] shadow-xs'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase">
                {t('farms.eyebrow', 'Hyperlocal Radius')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="farms-near-heading"
            className={`font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] ${
              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
            }`}
          >
            <span className="block">
              {t('farms.heading', 'Freshness Starts Nearby')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="farms-near-subtext"
            className={`mt-4 sm:mt-5 text-base sm:text-lg md:text-xl font-normal leading-relaxed font-sans ${
              isDark ? 'text-[#aba79c]' : 'text-[#57534e]'
            }`}
          >
            {t('farms.subtext', 'Discover participating farms close to you.')}
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* INTERACTIVE GOOGLE MAP & FARM INFO CARD */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 sm:mt-18"
        >
          <div
            id="farms-map-card"
            className={`group relative p-6 sm:p-8 md:p-10 rounded-3xl border-2 backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
              isDark
                ? 'bg-[#0e0d0b]/90 border-[#d4af37]/35 hover:border-[#d4af37] shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.4)]'
                : 'bg-white border-stone-200 hover:border-[#d4af37]/60 shadow-xl'
            }`}
          >
            {/* Quick Farm Location Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-stone-200 dark:border-[#d4af37]/20">
              <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`}>
                Select Farm Hub:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {pins.map((pin, idx) => {
                  const isSelected = activePin === idx;
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => setActivePin(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? isDark
                            ? 'bg-[#261f12] border-[#d4af37] text-[#fae69e] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                            : 'bg-[#faf6ee] border-[#d4af37] text-[#8f6208] font-bold shadow-xs'
                          : isDark
                          ? 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c] hover:text-[#fcfbf7]'
                          : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-[#d4af37]/40'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? (isDark ? 'text-[#fae69e]' : 'text-[#8f6208]') : 'text-stone-400'}`} />
                      <span>{pin.name}</span>
                      <span className={`text-[10px] ${isSelected ? (isDark ? 'text-[#d4af37]' : 'text-[#8f6208]') : 'text-stone-400'}`}>
                        ({pin.distance.replace(' away', '')})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* ========================================================================= */}
              {/* REAL GOOGLE MAP CONTAINER AREA (lg:col-span-7) */}
              {/* ========================================================================= */}
              <div className={`lg:col-span-7 relative h-[360px] sm:h-[440px] rounded-2xl border overflow-hidden shadow-inner flex flex-col justify-between ${
                isDark ? 'bg-[#11100c] border-[#d4af37]/30' : 'bg-stone-100 border-stone-200'
              }`}>
                {googleMapsReady ? (
                  /* Live Google Maps JS API rendering */
                  <div ref={mapRef} className="w-full h-full" />
                ) : (
                  /* Official Google Maps Native Embed with normal LIGHT appearance in Light Mode */
                  <div className="w-full h-full relative">
                    <iframe
                      title={`Google Maps - ${currentFarm.name}`}
                      src={googleEmbedUrl}
                      className={`w-full h-full border-0 ${
                        isDark
                          ? 'filter contrast-[1.05] brightness-[0.85] invert-[0.85] hue-rotate-180'
                          : 'filter contrast-[1.02]'
                      }`}
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Floating Map Status Overlay */}
                <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-xl border text-[11px] font-mono shadow-md backdrop-blur-md flex items-center gap-2 pointer-events-none z-10 ${
                  isDark
                    ? 'bg-black/85 border-[#d4af37]/50 text-[#fae69e]'
                    : 'bg-white/95 border-stone-200 text-[#1c1917]'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold">{currentFarm.name}</span>
                  <span className={isDark ? 'text-[#aba79c]' : 'text-stone-500'}>• {currentFarm.distance}</span>
                </div>

                {/* External Google Maps Button */}
                <div className="absolute bottom-3 right-3 z-10">
                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono font-medium shadow-md backdrop-blur-md transition-all ${
                      isDark
                        ? 'bg-black/85 hover:bg-black border-[#d4af37]/40 text-[#fae69e]'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-[#8f6208]'
                    }`}
                  >
                    <span>View in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                  </a>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* RIGHT-SIDE FARM INFORMATION PANEL (lg:col-span-5) */}
              {/* ========================================================================= */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full ${
                  isDark
                    ? 'bg-[#14120e] border-[#d4af37]/30 shadow-lg'
                    : 'bg-white border-stone-200 shadow-md'
                }`}>
                  <div>
                    {/* Top Bar: Today's Harvest Label + Pickup Badge */}
                    <div className={`flex items-center justify-between gap-2 mb-4 pb-3 border-b ${
                      isDark ? 'border-[#d4af37]/15' : 'border-stone-200'
                    }`}>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold ${
                        isDark ? 'text-[#34d399]' : 'text-emerald-700'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {currentFarm.harvest}
                      </span>

                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-medium ${
                        isDark
                          ? 'bg-[#1c180e] border-[#d4af37]/35 text-[#fae69e]'
                          : 'bg-[#faf8f5] border-[#d4af37]/40 text-[#8f6208]'
                      }`}>
                        {currentFarm.badge}
                      </span>
                    </div>

                    {/* Farmer Name & Distance */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-between">
                        <h3 className={`font-serif text-2xl font-bold tracking-wide ${
                          isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'
                        }`}>
                          {currentFarm.name}
                        </h3>
                        <span className={`text-xs font-mono font-bold ${
                          isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
                        }`}>
                          {currentFarm.distance}
                        </span>
                      </div>
                      <p className={`text-xs flex items-center gap-1.5 mt-1.5 font-sans ${
                        isDark ? 'text-[#aba79c]' : 'text-stone-600'
                      }`}>
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                        <span>{currentFarm.location}</span>
                      </p>
                    </div>

                    {/* Available Produce Small Tags */}
                    <div className="mb-6">
                      <span className={`text-[10px] font-mono uppercase tracking-widest font-semibold block mb-2.5 ${
                        isDark ? 'text-[#8e8b82]' : 'text-stone-500'
                      }`}>
                        {t('farms.manifestTitle', 'FRESH HARVEST MANIFEST:')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentFarm.products.map((prod, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-lg border text-xs font-sans font-medium transition-colors ${
                              isDark
                                ? 'bg-[#1a1710] border-[#d4af37]/25 text-[#e8dfca]'
                                : 'bg-[#faf8f5] border-stone-200 text-stone-800'
                            }`}
                          >
                            {prod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact & Reserve Actions */}
                  <div className="space-y-2.5 pt-4 border-t border-stone-200 dark:border-[#d4af37]/15">
                    <button
                      type="button"
                      onClick={() => navigate('/marketplace')}
                      className={`w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                        isDark
                          ? 'bg-[#1d1911] hover:bg-[#d4af37] text-[#fae69e] hover:text-[#0a0a0a] border-[#d4af37]/40 shadow-[0_0_15px_-5px_rgba(212,175,55,0.2)]'
                          : 'bg-[#faf6ee] hover:bg-[#d4af37] text-[#8f6208] hover:text-white border-[#d4af37]/50 hover:border-[#d4af37] shadow-xs'
                      }`}
                    >
                      <span>Reserve From This Plot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => window.open(googleMapsDirectionsUrl, '_blank')}
                      className={`w-full py-2.5 rounded-xl font-mono text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                        isDark
                          ? 'bg-[#14120e] hover:bg-[#1f1b13] text-[#aba79c] hover:text-[#fae69e] border-[#d4af37]/20'
                          : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border-stone-300'
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Get Driving Directions</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Button Below */}
          <div className="mt-10 flex justify-center">
            <button
              id="view-all-nearby-farms-btn"
              type="button"
              onClick={() => navigate('/farmers')}
              className={`group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'bg-[#12110c]/85 hover:bg-[#d4af37]/15 text-[#f5f3eb] border-[#d4af37]/45 hover:border-[#d4af37] shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)]'
                  : 'bg-white hover:bg-[#faf8f5] text-[#1c1917] border-[#d4af37]/50 hover:border-[#b89120] shadow-sm hover:shadow-md'
              }`}
            >
              <span>{t('farms.viewAllNearby', 'VIEW ALL NEARBY FARMS')}</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
