import React, { useState } from 'react';
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
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface FarmLocationPin {
  id: string;
  farmerName: string;
  farmerId: string;
  farmName?: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  produceCount?: number;
  specialty?: string;
}

// Pan-India authentic farm clusters
export const INDIAN_FARM_LOCATIONS: FarmLocationPin[] = [
  {
    id: 'karnataka-mandya',
    farmerName: 'Ravi Kumar',
    farmerId: 'AV-FARM-1001',
    farmName: 'Mandya Heritage Soil Orchard',
    city: 'Mandya',
    state: 'Karnataka',
    lat: 12.5218,
    lng: 76.8951,
    produceCount: 8,
    specialty: 'Heirloom Vegetables & Spices',
  },
  {
    id: 'karnataka-chikkamagaluru',
    farmerName: 'Lakshmi Devi',
    farmerId: 'AV-FARM-1002',
    farmName: 'Western Ghats Bio-Reserve Farm',
    city: 'Chikkamagaluru',
    state: 'Karnataka',
    lat: 13.3161,
    lng: 75.772,
    produceCount: 6,
    specialty: 'Arabica Coffee & Cardamom',
  },
  {
    id: 'maharashtra-nashik',
    farmerName: 'Suresh Naidu',
    farmerId: 'AV-FARM-1003',
    farmName: 'Sahyadri Organic Orchards',
    city: 'Nashik',
    state: 'Maharashtra',
    lat: 19.9975,
    lng: 73.7898,
    produceCount: 5,
    specialty: 'Table Grapes & Pomegranates',
  },
  {
    id: 'kashmir-pampore',
    farmerName: 'Ghulam Hassan',
    farmerId: 'AV-FARM-1004',
    farmName: 'Pampore Golden Saffron Fields',
    city: 'Pulwama',
    state: 'Jammu & Kashmir',
    lat: 34.0186,
    lng: 74.9332,
    produceCount: 3,
    specialty: 'Grade-A Mongra Saffron',
  },
  {
    id: 'punjab-ludhiana',
    farmerName: 'Gurpreet Singh',
    farmerId: 'AV-FARM-1005',
    farmName: 'Malwa Heritage Grain Fields',
    city: 'Ludhiana',
    state: 'Punjab',
    lat: 30.901,
    lng: 75.8573,
    produceCount: 4,
    specialty: 'Organic Sharbati Wheat & Basmati',
  },
  {
    id: 'assam-golaghat',
    farmerName: 'Pranab Saikia',
    farmerId: 'AV-FARM-1006',
    farmName: 'Brahmaputra Valley Tea Estate',
    city: 'Golaghat',
    state: 'Assam',
    lat: 26.5197,
    lng: 93.9664,
    produceCount: 4,
    specialty: 'Handcrafted CTC Tea & Assam Ginger',
  },
  {
    id: 'bengal-darjeeling',
    farmerName: 'Subhasish Roy',
    farmerId: 'AV-FARM-1007',
    farmName: 'Himalayan Foothills Orchard',
    city: 'Siliguri',
    state: 'West Bengal',
    lat: 26.7271,
    lng: 88.3953,
    produceCount: 5,
    specialty: 'Organic Mandarins & Ginger',
  },
  {
    id: 'kerala-wayanad',
    farmerName: 'Mathew Thomas',
    farmerId: 'AV-FARM-1008',
    farmName: 'Wayanad Rainforest Spices',
    city: 'Wayanad',
    state: 'Kerala',
    lat: 11.6854,
    lng: 76.132,
    produceCount: 7,
    specialty: 'Malabar Black Pepper & Nutmeg',
  },
];

interface GoogleFarmMapProps {
  locations?: FarmLocationPin[];
  singleLocation?: {
    city: string;
    state: string;
    farmerName?: string;
    farmerId?: string;
  };
  onSelectFarmer?: (farmerName: string) => void;
  className?: string;
}

export const GoogleFarmMap: React.FC<GoogleFarmMapProps> = ({
  locations = INDIAN_FARM_LOCATIONS,
  singleLocation,
  onSelectFarmer,
  className = '',
}) => {
  const { t } = useLanguage();
  const [activePin, setActivePin] = useState<FarmLocationPin | null>(null);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');

  const filteredLocations = selectedStateFilter === 'ALL'
    ? locations
    : locations.filter((loc) => loc.state.toLowerCase() === selectedStateFilter.toLowerCase());

  const googleMapsKey = typeof import.meta !== 'undefined' && (import.meta as any).env
    ? (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY
    : '';

  // For Single Location Mode (Product Detail / Farmer Profile)
  if (singleLocation) {
    const mapSearchQuery = encodeURIComponent(`${singleLocation.city}, ${singleLocation.state}, India`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

    return (
      <div className={`p-4 rounded-2xl bg-[#12100c] border border-[#d4af37]/35 space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-mono uppercase text-[#fae69e] font-semibold">
              {t('map.farmLocation', 'Farm & District Origin')}
            </span>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4af37] hover:text-[#fae69e] hover:underline"
          >
            <span>{t('map.openGoogleMaps', 'Open in Google Maps')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Visual Map Canvas Card */}
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#1c180e] to-[#0d0c0a] border border-[#d4af37]/20 flex flex-col items-center justify-center text-center p-3 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#fae69e] mx-auto animate-bounce">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div className="font-serif font-bold text-sm text-[#fcfbf7]">
              {singleLocation.city}, {singleLocation.state}
            </div>
            <div className="text-[10px] font-mono text-[#aba79c]">
              Verified Agricultural District • India
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pan-India Marketplace Map Mode
  const stateOptions = ['ALL', 'Karnataka', 'Maharashtra', 'Punjab', 'Jammu & Kashmir', 'Assam', 'West Bengal', 'Kerala'];

  return (
    <div className={`p-5 sm:p-7 rounded-3xl bg-[#0e0d0b] border-2 border-[#d4af37]/35 shadow-2xl space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-1">
            {t('map.exploreAcrossIndia', 'Pan-India Agricultural Network')}
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7] flex items-center gap-2">
            <span>{t('map.title', 'Explore Farmers Across India')}</span>
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
          </h3>
        </div>

        {/* State Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {stateOptions.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStateFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border cursor-pointer ${
                selectedStateFilter === st
                  ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] font-bold shadow-sm'
                  : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Map Area + Live Grower Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map Canvas */}
        <div className="lg:col-span-7 h-72 sm:h-96 rounded-2xl bg-gradient-to-b from-[#18140c] to-[#090807] border border-[#d4af37]/30 relative overflow-hidden shadow-inner flex flex-col justify-between p-4">
          <div className="absolute inset-0 bg-subtle-grid opacity-40 pointer-events-none" />

          {/* Compass and Coordinates HUD */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#8e8b82]">
            <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-[#d4af37]/25 backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>India Farmlands: 8.4°N to 37.6°N</span>
            </div>

            <div className="bg-black/60 px-2.5 py-1 rounded-full border border-[#34d399]/30 text-[#34d399]">
              {filteredLocations.length} Active Farm Hubs
            </div>
          </div>

          {/* Simulated Location Nodes on India Map */}
          <div className="relative z-10 flex-1 grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-2 items-center justify-items-center">
            {filteredLocations.map((loc) => {
              const isSelected = activePin?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setActivePin(loc)}
                  className={`p-2 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 text-center group ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#0a0a0a] scale-110 shadow-[0_0_20px_rgba(212,175,55,0.7)] ring-2 ring-white'
                      : 'bg-[#14120e]/90 hover:bg-[#201c10] border border-[#d4af37]/40 text-[#fcfbf7]'
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#0a0a0a]' : 'text-[#fae69e] group-hover:scale-110 transition-transform'}`} />
                  <span className="font-mono text-[10px] font-bold truncate max-w-[80px]">
                    {loc.city}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Prompt */}
          <div className="relative z-10 text-center text-[10px] font-mono text-[#736f66]">
            Select any agricultural hub above to view verified grower dossier & direct farm drops.
          </div>
        </div>

        {/* Right Grower Detail Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {activePin ? (
            <motion.div
              key={activePin.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#14120e] border-2 border-[#d4af37]/45 shadow-lg space-y-4 flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#fae69e] bg-[#221c10] px-2 py-0.5 rounded border border-[#d4af37]/35">
                    {activePin.farmerId}
                  </span>
                  <span className="text-[10px] font-mono text-[#34d399] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                    Verified Direct Farm
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#fcfbf7] mt-2">
                  {activePin.farmerName}
                </h4>
                <p className="text-xs text-[#aba79c]">{activePin.farmName}</p>
                <p className="text-xs text-[#d4af37] font-mono mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activePin.city}, {activePin.state}</span>
                </p>

                <div className="mt-3 p-3 rounded-xl bg-[#1a160e] border border-[#d4af37]/20 text-xs font-mono text-[#aba79c]">
                  <span className="text-[#8e8b82] block text-[10px]">Crop Specialty:</span>
                  <strong className="text-[#fcfbf7]">{activePin.specialty}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-[#d4af37]/20 flex items-center gap-2">
                {onSelectFarmer && (
                  <button
                    type="button"
                    onClick={() => onSelectFarmer(activePin.farmerName)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider text-center cursor-pointer hover:brightness-110"
                  >
                    View Farmer Dossier
                  </button>
                )}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activePin.city}, ${activePin.state}, India`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#1e1910] border border-[#d4af37]/30 text-[#fae69e] hover:bg-[#2a2214]"
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#14120e] border border-[#d4af37]/20 text-center flex flex-col items-center justify-center flex-1 space-y-3">
              <Wheat className="w-8 h-8 text-[#d4af37]" />
              <div className="font-serif font-bold text-base text-[#fcfbf7]">
                Select a Farm Hub on the Map
              </div>
              <p className="text-xs text-[#aba79c] max-w-xs">
                Browse verified direct growers from Karnataka, Maharashtra, Punjab, Kashmir, Assam, and across India.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
