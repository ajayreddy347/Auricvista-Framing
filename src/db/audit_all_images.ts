import { query } from './index';
import { getProduceImage } from '../utils/produceImages';

async function auditProduce() {
  const res = await query(`SELECT id, name, category, images, price as "pricePerUnit", unit FROM produce_listings ORDER BY category, name;`);
  console.log(`Auditing all ${res.rows.length} produce listings in PostgreSQL:\n`);
  
  res.rows.forEach((p, i) => {
    const resolved = getProduceImage(p);
    console.log(`${i + 1}. [${p.category}] "${p.name}"`);
    console.log(`   -> Resolved Image: ${resolved}`);
  });
}

auditProduce()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
