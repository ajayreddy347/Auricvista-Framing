import { query } from './index';
import { getCanonicalProduct } from '../utils/canonicalProducts';
import { getProduceImage, NEUTRAL_CROP_PLACEHOLDER } from '../utils/produceImages';

async function runImageValidationAudit() {
  const res = await query(`SELECT id, name, category, price, unit FROM produce_listings ORDER BY category, name;`);
  const rows = res.rows;

  console.log(`\n================================================================================`);
  console.log(`AURIC AROHI — STRICT PRODUCT → CANONICAL IMAGE VALIDATION AUDIT`);
  console.log(`Total Database Listings: ${rows.length}`);
  console.log(`================================================================================\n`);

  let passCount = 0;
  let failCount = 0;

  const tableRows: Array<{
    num: number;
    productName: string;
    canonicalId: string;
    category: string;
    image: string;
    status: string;
  }> = [];

  rows.forEach((r, idx) => {
    const canonical = getCanonicalProduct(r.name);
    const resolvedImage = getProduceImage(r);

    let status = 'PASS';
    let failReason = '';

    if (!canonical) {
      status = 'FAIL (Unknown Canonical Product)';
      failCount++;
    } else if (resolvedImage === NEUTRAL_CROP_PLACEHOLDER) {
      status = 'FAIL (Missing Image)';
      failCount++;
    } else if (resolvedImage.includes('random') || resolvedImage.includes('placeholder_broken')) {
      status = 'FAIL (Invalid Image)';
      failCount++;
    } else {
      passCount++;
    }

    tableRows.push({
      num: idx + 1,
      productName: r.name,
      canonicalId: canonical ? canonical.id : 'UNKNOWN',
      category: r.category,
      image: resolvedImage.slice(0, 55) + (resolvedImage.length > 55 ? '...' : ''),
      status: status === 'PASS' ? '✅ PASS' : `❌ ${status}`,
    });
  });

  // Print table
  console.log(
    `# | Product Name | Canonical ID | Category | Image Preview | Status`
  );
  console.log(
    `---------------------------------------------------------------------------------------------------------`
  );
  tableRows.forEach((tr) => {
    console.log(
      `${tr.num.toString().padEnd(3)} | ${tr.productName.slice(0, 38).padEnd(38)} | ${tr.canonicalId.padEnd(18)} | ${tr.category.padEnd(18)} | ${tr.image.padEnd(30)} | ${tr.status}`
    );
  });

  console.log(`\n================================================================================`);
  console.log(`AUDIT RESULTS: ${passCount} PASSED / ${rows.length} TOTAL (Failures: ${failCount})`);
  console.log(`================================================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runImageValidationAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Audit execution error:', err);
    process.exit(1);
  });
