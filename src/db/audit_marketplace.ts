import { query } from './index';
import { getProduceImage } from '../utils/produceImages';

async function auditMarketplace() {
  console.log('=== AURIC AROHI MARKETPLACE DATA INTEGRITY AUDIT ===\n');

  const res = await query('SELECT * FROM produce_listings ORDER BY category, name');
  const listings = res.rows;

  console.log(`Total produce listings in PostgreSQL: ${listings.length}\n`);

  const seenNames = new Set<string>();
  const duplicates: string[] = [];
  const categoriesCount: Record<string, number> = {};
  const farmersCount: Record<string, number> = {};
  const locationsCount: Record<string, number> = {};

  let missingImages = 0;
  let invalidPrices = 0;

  for (const item of listings) {
    // 1. Check duplicate product names
    if (seenNames.has(item.name)) {
      duplicates.push(item.name);
    }
    seenNames.add(item.name);

    // 2. Count categories
    categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;

    // 3. Count farmers
    farmersCount[item.farmer_name] = (farmersCount[item.farmer_name] || 0) + 1;

    // 4. Count locations
    locationsCount[item.farm_location] = (locationsCount[item.farm_location] || 0) + 1;

    // 5. Image check
    const resolvedImage = getProduceImage(item);
    if (!resolvedImage) {
      missingImages++;
    }

    if (!item.price || item.price <= 0) {
      invalidPrices++;
    }
  }

  console.log('--- CATEGORY DISTRIBUTION ---');
  for (const [cat, count] of Object.entries(categoriesCount)) {
    console.log(`• ${cat}: ${count} products`);
  }

  console.log('\n--- FARMER DISTRIBUTION (DIVERSITY CHECK) ---');
  for (const [farmer, count] of Object.entries(farmersCount)) {
    console.log(`• ${farmer}: ${count} listings`);
  }

  console.log('\n--- LOCATION DIVERSITY (SAMPLE LOCATIONS) ---');
  const uniqueLocations = Object.keys(locationsCount);
  console.log(`Total Unique Real Farm Locations: ${uniqueLocations.length}`);
  uniqueLocations.slice(0, 10).forEach((loc) => console.log(`  - ${loc}`));

  console.log('\n--- INTEGRITY CHECKS ---');
  console.log(`Duplicate product names: ${duplicates.length === 0 ? '0 (PASSED)' : duplicates.join(', ')}`);
  console.log(`Missing/broken images: ${missingImages === 0 ? '0 (PASSED)' : missingImages}`);
  console.log(`Invalid prices: ${invalidPrices === 0 ? '0 (PASSED)' : invalidPrices}`);

  console.log('\n=== AUDIT COMPLETED SUCCESSFULLY ===');
}

auditMarketplace()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
