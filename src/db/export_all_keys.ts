import fs from 'fs';
import { translations } from '../translations';

const en = translations['en'];
const keys = Object.keys(en);

console.log(`Total keys: ${keys.length}`);
console.log('Sample key prefixes:', Array.from(new Set(keys.map(k => k.split('.')[0]))));
