import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';
import { LanguageCode } from '../translations';

const sampleProducts = [
  "Kashmiri Snow-White Walnut Kernels (Akhrot Giri)",
  "Extra Virgin Cold-Pressed Coconut Oil (Marachekku)",
  "Cold-Pressed Groundnut Oil (Wood-Pressed Kacchi Ghani)",
  "Sundarbans Wild Mangrove Multi-Floral Raw Honey",
  "Kolhapur Artisanal Sugarcane Jaggery (Organic Gur)",
  "Crisp Hydroponic Butterhead Salad Lettuce",
  "Heirloom Vine Tomatoes (Tamatar)",
  "Robusta Mountain Bananas (Fresh Bunch)",
  "Shimla Royal Delicious Mountain Apples",
  "Gulbarga Desi Unpolished Toor Dal (Arhar)"
];

const testLangs: LanguageCode[] = ['en', 'kn', 'hi', 'te', 'ta', 'ur'];

console.log('Testing produce name localization:\n');
for (const prod of sampleProducts) {
  console.log(`Original: "${prod}"`);
  for (const lang of testLangs) {
    console.log(`   [${lang.toUpperCase()}] -> "${getLocalizedProduceName(prod, lang)}"`);
  }
  console.log('');
}
