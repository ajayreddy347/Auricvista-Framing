import { query } from './index';
import { getProduceImage } from '../utils/produceImages';

async function auditFirstHalf() {
  const res = await query(`SELECT id, name, category, images, price as "pricePerUnit", unit FROM produce_listings ORDER BY category, name LIMIT 34;`);
  res.rows.forEach((p, i) => {
    const resolved = getProduceImage(p);
    console.log(`${i + 1}. [${p.category}] "${p.name}"`);
    console.log(`   -> Resolved: ${resolved}`);
  });
}

auditFirstHalf()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
