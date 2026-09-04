import { query } from './index';

async function cleanupDuplicates() {
  console.log('[Cleanup] Standardizing categories and removing legacy duplicate entries...');

  // 1. Standardize categories
  await query(`UPDATE produce_listings SET category = 'Spices & Seasonings' WHERE category = 'Spices';`);
  await query(`UPDATE produce_listings SET category = 'Vegetables' WHERE category = 'Farm Fresh' AND (name ILIKE '%tomato%' OR name ILIKE '%spinach%' OR name ILIKE '%carrot%');`);
  await query(`UPDATE produce_listings SET category = 'Organic & Natural' WHERE category = 'Farm Fresh' OR category = 'Organic / Natural';`);
  await query(`UPDATE produce_listings SET category = 'Grains & Cereals' WHERE category = 'Grains';`);
  await query(`UPDATE produce_listings SET category = 'Pulses & Dals' WHERE category = 'Pulses';`);

  // 2. Remove duplicate rows keeping the newest entry
  await query(`
    DELETE FROM produce_listings a USING produce_listings b
    WHERE a.id < b.id AND LOWER(TRIM(a.name)) = LOWER(TRIM(b.name));
  `);

  console.log('[Cleanup] Finished successfully.');
}

cleanupDuplicates()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
