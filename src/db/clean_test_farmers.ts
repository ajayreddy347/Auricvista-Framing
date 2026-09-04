import { query } from './index';

async function cleanTestFarmers() {
  console.log('[Cleanup] Cleaning legacy test farmer accounts...');

  // Delete test accounts like Mallesh Gowda test iterations with 0 listings
  await query(`DELETE FROM farmer_profiles WHERE farm_name ILIKE '%test%' OR farmer_slug ILIKE 'test%' OR farmer_slug ILIKE '%mallesh%' OR farmer_slug ILIKE 'anand%' OR farmer_slug ILIKE 'ramesh%' OR farmer_slug ILIKE 'basavaraj%' OR farmer_slug ILIKE 'manjunath%';`);
  await query(`DELETE FROM users WHERE email ILIKE '%test%' OR email ILIKE '%demo%' OR name ILIKE 'Mallesh Gowda%' OR (role = 'farmer' AND email NOT LIKE '%@auricvista.farm');`);

  console.log('[Cleanup] Successfully cleaned legacy test farmer accounts.');
}

cleanTestFarmers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
