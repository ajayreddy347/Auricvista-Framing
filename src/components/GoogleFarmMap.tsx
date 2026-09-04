import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  Building2,
  Wheat,
  Eye,
  X,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  LocateFixed,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export interface FarmLocationPin {
  id: string;
  farmerName: string;
  farmerId: string;
  farmName?: string;
  location: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  produceCount: number;
  specialty?: string;
  highlightBadge?: string;
  description?: string;
}

// Safe representative district/state coordinates (never exposing private addresses)
export const SAFE_DISTRICT_COORDINATES: Record<string, { lat: number; lng: number; city: string; state: string }> = {
  chikkaballapur: { lat: 13.4355, lng: 77.7315, city: 'Chikkaballapur', state: 'Karnataka' },
  mandya: { lat: 12.5218, lng: 76.8951, city: 'Mandya', state: 'Karnataka' },
  kolar: { lat: 13.1367, lng: 78.1291, city: 'Kolar', state: 'Karnataka' },
  hosur: { lat: 12.7409, lng: 77.8253, city: 'Hosur', state: 'Tamil Nadu' },
  ratnagiri: { lat: 16.9902, lng: 73.312, city: 'Ratnagiri', state: 'Maharashtra' },
  mahabaleshwar: { lat: 17.9237, lng: 73.6586, city: 'Mahabaleshwar', state: 'Maharashtra' },
  ludhiana: { lat: 30.901, lng: 75.8573, city: 'Ludhiana', state: 'Punjab' },
  unjha: { lat: 23.8042, lng: 72.392, city: 'Unjha', state: 'Gujarat' },
  junagadh: { lat: 21.5222, lng: 70.4579, city: 'Junagadh', state: 'Gujarat' },
  wayanad: { lat: 11.6854, lng: 76.132, city: 'Wayanad', state: 'Kerala' },
  idukki: { lat: 9.8494, lng: 76.9804, city: 'Idukki', state: 'Kerala' },
  nagaur: { lat: 27.207, lng: 73.7423, city: 'Nagaur', state: 'Rajasthan' },
  jodhpur: { lat: 26.2389, lng: 73.0243, city: 'Jodhpur', state: 'Rajasthan' },
  guntur: { lat: 16.3067, lng: 80.4365, city: 'Guntur', state: 'Andhra Pradesh' },
  tenali: { lat: 16.243, lng: 80.64, city: 'Tenali', state: 'Andhra Pradesh' },
  shimla: { lat: 31.1048, lng: 77.1734, city: 'Shimla', state: 'Himachal Pradesh' },
  solan: { lat: 30.9084, lng: 77.0999, city: 'Solan', state: 'Himachal Pradesh' },
  sundarbans: { lat: 21.9497, lng: 88.9004, city: 'Sundarbans', state: 'West Bengal' },
  pollachi: { lat: 10.6609, lng: 77.0048, city: 'Pollachi', state: 'Tamil Nadu' },
  coimbatore: { lat: 11.0168, lng: 76.9558, city: 'Coimbatore', state: 'Tamil Nadu' },
  nashik: { lat: 19.9975, lng: 73.7898, city: 'Nashik', state: 'Maharashtra' },
  kolhapur: { lat: 16.705, lng: 74.2433, city: 'Kolhapur', state: 'Maharashtra' },
  pampore: { lat: 34.0186, lng: 74.9332, city: 'Pampore', state: 'Jammu & Kashmir' },
  sopore: { lat: 34.298, lng: 74.4691, city: 'Sopore', state: 'Jammu & Kashmir' },
  koraput: { lat: 18.8124, lng: 82.7108, city: 'Koraput', state: 'Odisha' },
  solapur: { lat: 17.6599, lng: 75.9064, city: 'Solapur', state: 'Maharashtra' },
  sirsi: { lat: 14.6195, lng: 74.8354, city: 'Sirsi', state: 'Karnataka' },
  hassan: { lat: 13.0033, lng: 76.1004, city: 'Hassan', state: 'Karnataka' },
  belagavi: { lat: 15.8497, lng: 74.4977, city: 'Belagavi', state: 'Karnataka' },
  ooty: { lat: 11.4102, lng: 76.695, city: 'Ooty', state: 'Tamil Nadu' },
  nilgiris: { lat: 11.4102, lng: 76.695, city: 'Nilgiris', state: 'Tamil Nadu' },
  dehradun: { lat: 30.3165, lng: 78.0322, city: 'Dehradun', state: 'Uttarakhand' },
  raichur: { lat: 16.2076, lng: 77.3463, city: 'Raichur', state: 'Karnataka' },
};

export function resolveSafeCoordinates(locationStr: string): { lat: number; lng: number; city: string; state: string } {
  const lower = (locationStr || '').toLowerCase();

  for (const [key, coords] of Object.entries(SAFE_DISTRICT_COORDINATES)) {
    if (lower.includes(key)) {
      return coords;
    }
  }

  if (lower.includes('karnataka')) return { lat: 13.4355, lng: 77.7315, city: 'Chikkaballapur', state: 'Karnataka' };
  if (lower.includes('maharashtra')) return { lat: 19.9975, lng: 73.7898, city: 'Nashik', state: 'Maharashtra' };
  if (lower.includes('kerala')) return { lat: 11.6854, lng: 76.132, city: 'Wayanad', state: 'Kerala' };
  if (lower.includes('tamil nadu')) return { lat: 10.6609, lng: 77.0048, city: 'Pollachi', state: 'Tamil Nadu' };
  if (lower.includes('punjab')) return { lat: 30.901, lng: 75.8573, city: 'Ludhiana', state: 'Punjab' };
  if (lower.includes('himachal')) return { lat: 31.1048, lng: 77.1734, city: 'Shimla', state: 'Himachal Pradesh' };
  if (lower.includes('kashmir')) return { lat: 34.0186, lng: 74.9332, city: 'Pampore', state: 'Jammu & Kashmir' };
  if (lower.includes('gujarat')) return { lat: 23.8042, lng: 72.392, city: 'Unjha', state: 'Gujarat' };
  if (lower.includes('rajasthan')) return { lat: 27.207, lng: 73.7423, city: 'Nagaur', state: 'Rajasthan' };
  if (lower.includes('bengal')) return { lat: 21.9497, lng: 88.9004, city: 'Sundarbans', state: 'West Bengal' };

  return { lat: 12.9716, lng: 77.5946, city: 'Bengaluru Agri Hub', state: 'Karnataka' };
}

interface GoogleFarmMapProps {
  singleLocation?: {
    city?: string;
    state?: string;
    farmerName?: string;
    farmerId?: string;
    location?: string;
  };
  onSelectFarmer?: (farmerName: string) => void;
  className?: string;
}

export const GoogleFarmMap: React.FC<GoogleFarmMapProps> = ({
  singleLocation,
  onSelectFarmer,
  className = '',
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [dbFarmers, setDbFarmers] = useState<FarmLocationPin[]>([]);
  const [isLoadingFarmers, setIsLoadingFarmers] = useState(true);
  const [activePin, setActivePin] = useState<FarmLocationPin | null>(null);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [mapSearch, setMapSearch] = useState<string>('');
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [googleMapsReady, setGoogleMapsReady] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const googleMapsKey =
    typeof import.meta !== 'undefined' && (import.meta as any).env
      ? (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY
      : '';

  // 1. Fetch Real Farmers & Produce from PostgreSQL
  useEffect(() => {
    let isMounted = true;

    async function loadPostgreSqlFarmers() {
      setIsLoadingFarmers(true);
      try {
        const [farmersRes, produceRes] = await Promise.all([
          fetch('/api/farmers'),
          fetch('/api/produce'),
        ]);

        const farmersData = farmersRes.ok ? await farmersRes.json() : [];
        const produceData = produceRes.ok ? await produceRes.json() : [];

        if (Array.isArray(farmersData) && farmersData.length > 0 && isMounted) {
          const pins: FarmLocationPin[] = farmersData.map((f: any) => {
            const rawLoc = f.location || f.farmName || '';
            const safe = resolveSafeCoordinates(rawLoc);

            const activeItems = Array.isArray(produceData)
              ? produceData.filter(
                  (p: any) =>
                    p.farmerName?.toLowerCase() === f.growerName?.toLowerCase() ||
                    p.farmerEmail === f.email
                )
              : [];

            return {
              id: f.farmerSlug || f.id || `farm-${f.farmerId}`,
              farmerName: f.growerName || f.farmerName || 'Verified Grower',
              farmerId: f.farmerId || 'AV-FARM-1001',
              farmName: f.farmName || `${f.growerName}'s Natural Farm`,
              location: rawLoc,
              city: safe.city,
              state: safe.state,
              lat: f.latitude ? Number(f.latitude) : safe.lat,
              lng: f.longitude ? Number(f.longitude) : safe.lng,
              produceCount: activeItems.length || Number(f.activeListingsCount) || 1,
              specialty: f.specialty || 'Organic Crops & Spices',
              highlightBadge: f.highlightBadge || 'Master Grower',
              description: f.description || 'Dedicated to organic Indian agriculture.',
            };
          });

          setDbFarmers(pins);
          if (pins.length > 0 && !activePin) {
            setActivePin(pins[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load farmers from PostgreSQL for map:', err);
      } finally {
        if (isMounted) setIsLoadingFarmers(false);
      }
    }

    loadPostgreSqlFarmers();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load Google Maps Script if API Key is available
  useEffect(() => {
    if (!googleMapsKey) {
      setGoogleMapsReady(false);
      return;
    }

    if ((window as any).google?.maps) {
      setGoogleMapsReady(true);
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

  // Filtered farmers list
  const filteredFarmers = useMemo(() => {
    return dbFarmers.filter((f) => {
      const matchesState =
        selectedStateFilter === 'ALL' ||
        f.state.toLowerCase() === selectedStateFilter.toLowerCase() ||
        f.location.toLowerCase().includes(selectedStateFilter.toLowerCase());

      const q = mapSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.farmerName.toLowerCase().includes(q) ||
        f.farmerId.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q) ||
        f.state.toLowerCase().includes(q) ||
        f.specialty?.toLowerCase().includes(q);

      return matchesState && matchesSearch;
    });
  }, [dbFarmers, selectedStateFilter, mapSearch]);

  // 3. Initialize / Update Google Map instance with Dark Luxury Theme & Markers
  useEffect(() => {
    if (!googleMapsReady || !mapContainerRef.current || !(window as any).google?.maps) return;

    try {
      const googleMaps = (window as any).google.maps;

      // Dark luxury map styling
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

      if (!googleMapInstance.current) {
        googleMapInstance.current = new googleMaps.Map(mapContainerRef.current, {
          center: { lat: 21.0, lng: 78.5 },
          zoom: 4.8,
          styles: darkMapStyle,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
      }

      // Clear existing markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Add markers for all filtered farmers
      filteredFarmers.forEach((farmer) => {
        const marker = new googleMaps.Marker({
          position: { lat: farmer.lat, lng: farmer.lng },
          map: googleMapInstance.current,
          title: `${farmer.farmerName} (${farmer.city}, ${farmer.state})`,
          icon: {
            path: googleMaps.SymbolPath.CIRCLE,
            scale: activePin?.id === farmer.id ? 10 : 7,
            fillColor: activePin?.id === farmer.id ? '#fae69e' : '#d4af37',
            fillOpacity: 1,
            strokeColor: '#0a0a0a',
            strokeWeight: 2,
          },
        });

        marker.addListener('click', () => {
          setActivePin(farmer);
          googleMapInstance.current.panTo({ lat: farmer.lat, lng: farmer.lng });
        });

        markersRef.current.push(marker);
      });
    } catch (err) {
      console.error('Google Maps initialization error:', err);
    }
  }, [googleMapsReady, filteredFarmers, activePin]);

  // 4. GET DIRECTIONS FROM USER'S LIVE DEVICE LOCATION
  const handleGetLiveDirections = (farmer: FarmLocationPin) => {
    setGeoError(null);
    setGeoLocating(true);

    const destinationQuery = `${farmer.city}, ${farmer.state}, India`;

    if (!('geolocation' in navigator)) {
      setGeoLocating(false);
      setGeoError('Geolocation is not supported by your browser.');
      // Open Google Maps destination directly
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}&travelmode=driving`,
        '_blank'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const originCoord = `${pos.coords.latitude},${pos.coords.longitude}`;
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${encodeURIComponent(destinationQuery)}&travelmode=driving`;
        window.open(directionsUrl, '_blank');
      },
      (err) => {
        setGeoLocating(false);
        console.warn('Geolocation denied or unavailable:', err.message);
        setGeoError('Location access is needed to provide directions from your current location.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // State Options for Filtering
  const stateOptions = [
    'ALL',
    'Karnataka',
    'Maharashtra',
    'Punjab',
    'Himachal Pradesh',
    'Gujarat',
    'Kerala',
    'Tamil Nadu',
    'Andhra Pradesh',
    'Rajasthan',
    'West Bengal',
    'Jammu & Kashmir',
  ];

  // SINGLE LOCATION MODE (For Product Detail / Farmer Profile Modals)
  if (singleLocation) {
    const rawLoc = singleLocation.location || `${singleLocation.city}, ${singleLocation.state}`;
    const safe = resolveSafeCoordinates(rawLoc);
    const destinationQuery = `${safe.city}, ${safe.state}, India`;
    const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationQuery)}`;

    return (
      <div className={`p-4 sm:p-5 rounded-2xl bg-[#12100c] border border-[#d4af37]/35 space-y-3.5 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-mono uppercase text-[#fae69e] font-semibold">
              {t('map.farmLocation', 'Farm & District Origin')}
            </span>
          </div>

          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4af37] hover:text-[#fae69e] hover:underline"
          >
            <span>{t('map.openGoogleMaps', 'Open in Google Maps')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Visual Map Canvas Card */}
        <div className="relative h-36 rounded-xl bg-gradient-to-br from-[#1c180e] to-[#0d0c0a] border border-[#d4af37]/20 flex flex-col items-center justify-center text-center p-3 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#fae69e] mx-auto shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <MapPin className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div className="font-serif font-bold text-base text-[#fcfbf7]">
              {safe.city}, {safe.state}
            </div>
            <div className="text-[11px] font-mono text-[#aba79c]">
              Verified Agricultural District • India
            </div>
          </div>
        </div>

        {/* Action Button: Live GPS Directions */}
        <button
          type="button"
          onClick={() => {
            if (!('geolocation' in navigator)) {
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}&travelmode=driving`, '_blank');
              return;
            }
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const url = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${encodeURIComponent(destinationQuery)}&travelmode=driving`;
                window.open(url, '_blank');
              },
              () => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}&travelmode=driving`, '_blank');
              }
            );
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#221c10] to-[#14120e] hover:bg-[#2c2414] border border-[#d4af37]/40 text-xs font-mono font-bold text-[#fae69e] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{t('map.getDirections', 'Get Directions from Current Location')}</span>
        </button>
      </div>
    );
  }

  // PAN-INDIA EXPLORE FARMERS MAP MODE
  return (
    <div className={`p-5 sm:p-7 rounded-3xl bg-[#0e0d0b] border-2 border-[#d4af37]/35 shadow-2xl space-y-6 ${className}`}>
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-1">
            {t('map.exploreAcrossIndia', 'Pan-India Agricultural Network')}
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7] flex items-center gap-2">
            <span>{t('map.title', 'Explore Farmers Across India')}</span>
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
          </h3>
          <p className="text-xs text-[#aba79c] mt-1">
            {t('map.desc', 'Discover verified farmers and fresh produce directly from farms across India.')}
          </p>
        </div>

        {/* Search Farmers Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            placeholder={t('map.searchPlaceholder', 'Search farmer or district...')}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs text-[#fcfbf7] placeholder-[#7a766e] focus:outline-none focus:border-[#fae69e]"
          />
          {mapSearch && (
            <button
              type="button"
              onClick={() => setMapSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8e8b82] hover:text-[#fcfbf7]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. STATE FILTER PILLS (Responsive wrap layout - NO horizontal scrollbar) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
        {stateOptions.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setSelectedStateFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
              selectedStateFilter === st
                ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] font-bold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7] hover:border-[#d4af37]/50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* 3. INTERACTIVE MAP + GROWER CARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Viewport */}
        <div className="lg:col-span-7 h-80 sm:h-[420px] rounded-2xl bg-[#090807] border border-[#d4af37]/35 relative overflow-hidden shadow-inner flex flex-col justify-between">
          {/* Real Google Maps Container */}
          {googleMapsReady ? (
            <div ref={mapContainerRef} className="w-full h-full" />
          ) : (
            /* Graceful Interactive Dark Canvas Fallback */
            <div className="w-full h-full relative p-4 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#18140c] to-[#090807]">
              <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />

              {/* HUD Header */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#8e8b82]">
                <div className="flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full border border-[#d4af37]/30 backdrop-blur-md">
                  <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Interactive India Agro Map</span>
                </div>
                <div className="bg-black/70 px-2.5 py-1 rounded-full border border-[#34d399]/40 text-[#34d399] font-bold">
                  {filteredFarmers.length} Verified Farms in PostgreSQL
                </div>
              </div>

              {/* Interactive Farmer Node Grid */}
              <div className="relative z-10 flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-2 items-center overflow-y-auto">
                {filteredFarmers.map((farmer) => {
                  const isSelected = activePin?.id === farmer.id;
                  return (
                    <button
                      key={farmer.id}
                      type="button"
                      onClick={() => setActivePin(farmer)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 text-center group border ${
                        isSelected
                          ? 'bg-[#d4af37] text-[#0a0a0a] scale-105 shadow-[0_0_20px_rgba(212,175,55,0.7)] border-white ring-1 ring-white'
                          : 'bg-[#14120e]/95 hover:bg-[#201c10] border-[#d4af37]/35 text-[#fcfbf7]'
                      }`}
                    >
                      <MapPin
                        className={`w-4 h-4 ${
                          isSelected ? 'text-[#0a0a0a]' : 'text-[#fae69e] group-hover:scale-110 transition-transform'
                        }`}
                      />
                      <span className="font-mono text-[10px] font-bold truncate max-w-[100px]">
                        {farmer.city}
                      </span>
                      <span
                        className={`text-[9px] font-mono truncate max-w-[90px] ${
                          isSelected ? 'text-[#1a140a]' : 'text-[#aba79c]'
                        }`}
                      >
                        {farmer.farmerName}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 text-center text-[10px] font-mono text-[#736f66] bg-black/60 py-1 rounded-lg border border-[#d4af37]/15">
                Click any farm marker above to inspect verified grower dossier & get GPS driving directions.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Selected Grower Detail Dossier */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {activePin ? (
            <motion.div
              key={activePin.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-2xl bg-[#14120e] border-2 border-[#d4af37]/50 shadow-xl space-y-4 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Farmer ID & Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#fae69e] bg-[#221c10] px-2.5 py-1 rounded border border-[#d4af37]/40 shadow-sm">
                    {activePin.farmerId}
                  </span>
                  <span className="text-[10px] font-mono text-[#34d399] flex items-center gap-1 bg-[#0e1c12] px-2 py-0.5 rounded border border-[#34d399]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                    Verified Direct Farm
                  </span>
                </div>

                {/* Farmer Name & Farm Location */}
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#fcfbf7] leading-tight">
                    {activePin.farmerName}
                  </h4>
                  <p className="text-xs text-[#aba79c] mt-0.5">{activePin.farmName}</p>
                  <p className="text-xs text-[#d4af37] font-mono mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{activePin.city}, {activePin.state}</span>
                  </p>
                </div>

                {/* Available Produce & Specialty */}
                <div className="p-3.5 rounded-xl bg-[#1a160e] border border-[#d4af37]/25 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#8e8b82]">Active Harvests:</span>
                    <strong className="text-[#fae69e]">{activePin.produceCount} Listed Crops</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#8e8b82]">Specialty:</span>
                    <strong className="text-[#fcfbf7] truncate max-w-[170px]">{activePin.specialty}</strong>
                  </div>
                </div>

                {/* Geo Error Alert Banner if permission denied */}
                {geoError && (
                  <div className="p-3 rounded-xl bg-[#2a1414] border border-[#f87171]/50 text-xs font-mono text-[#fca5a5] space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#f87171] shrink-0 mt-0.5" />
                      <span>{geoError}</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${activePin.city}, ${activePin.state}, India`)}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-1.5 rounded-lg bg-[#3a1a1a] text-center text-[11px] font-bold text-white hover:underline"
                    >
                      Open Destination in Google Maps ➔
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#d4af37]/25 space-y-2.5">
                {/* 1. GET DIRECTIONS FROM LIVE CURRENT LOCATION */}
                <button
                  type="button"
                  disabled={geoLocating}
                  onClick={() => handleGetLiveDirections(activePin)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-110 active:scale-95 disabled:opacity-60 transition-all"
                >
                  <Navigation className={`w-4 h-4 text-[#0a0a0a] ${geoLocating ? 'animate-spin' : ''}`} />
                  <span>
                    {geoLocating ? 'Acquiring GPS Location...' : 'Get Directions from My Location'}
                  </span>
                </button>

                {/* 2. Secondary Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectFarmer) {
                        onSelectFarmer(activePin.farmerName);
                      } else {
                        navigate('/marketplace');
                      }
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#1e1910] hover:bg-[#2a2214] border border-[#d4af37]/40 text-xs font-mono font-bold text-[#fae69e] text-center cursor-pointer active:scale-95 transition-all truncate"
                  >
                    View Farmer
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activePin.city}, ${activePin.state}, India`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#1e1910] hover:bg-[#2a2214] border border-[#d4af37]/40 text-xs font-mono text-[#aba79c] hover:text-[#fcfbf7] flex items-center justify-center gap-1 text-center cursor-pointer active:scale-95 transition-all truncate"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#14120e] border border-[#d4af37]/25 text-center flex flex-col items-center justify-center flex-1 space-y-3">
              <Wheat className="w-10 h-10 text-[#d4af37]" />
              <div className="font-serif font-bold text-lg text-[#fcfbf7]">
                Select a Farm Hub on the Map
              </div>
              <p className="text-xs text-[#aba79c] max-w-xs leading-relaxed">
                Explore real verified farmers from Karnataka, Maharashtra, Punjab, Kashmir, Assam, and across India loaded live from PostgreSQL.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
