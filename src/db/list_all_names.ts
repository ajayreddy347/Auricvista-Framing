import { query } from './index';

async function listAllNames() {
  const res = await query(`SELECT id, name, category, price, unit FROM produce_listings ORDER BY category, name;`);
  console.log(`Total listings: ${res.rows.length}\n`);
  res.rows.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.category}] "${r.name}"`);
  });
}

listAllNames()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
