import fs from 'fs';
import path from 'path';
import { query } from './index';
import { getCanonicalProduct } from '../utils/canonicalProducts';
import { getProduceImage, NEUTRAL_CROP_PLACEHOLDER } from '../utils/produceImages';

async function auditLocalProduceAssets() {
  const res = await query(`SELECT id, name, category, price, unit, farmer_email FROM produce_listings ORDER BY category, name;`);
  const rows = res.rows;

  console.log(`\n================================================================================`);
  console.log(`AURIC AROHI — REAL LOCAL ASSET & VISUAL PRODUCT VERIFICATION AUDIT`);
  console.log(`Total Database Listings: ${rows.length}`);
  console.log(`================================================================================\n`);

  let passCount = 0;
  let failCount = 0;

  console.log(
    `#   | Product Name                           | Canonical ID       | Local Asset File                                      | Size (Bytes) | Status`
  );
  console.log(
    `------------------------------------------------------------------------------------------------------------------------------------------------`
  );

  rows.forEach((r, idx) => {
    const canonical = getCanonicalProduct(r.name);
    const resolvedAsset = getProduceImage(r);
    
    // Check if asset exists in public folder
    let fileExists = false;
    let fileSize = 0;
    let status = 'PASS';
    let failReason = '';

    if (resolvedAsset.startsWith('/')) {
      const publicFilePath = path.join(process.cwd(), 'public', resolvedAsset.replace(/^\//, ''));
      if (fs.existsSync(publicFilePath)) {
        fileExists = true;
        fileSize = fs.statSync(publicFilePath).size;
      }
    }

    if (!canonical) {
      status = 'FAIL: No Canonical Product Matched';
      failCount++;
    } else if (resolvedAsset === NEUTRAL_CROP_PLACEHOLDER) {
      status = 'FAIL: Returned Placeholder';
      failCount++;
    } else if (!fileExists || fileSize < 1000) {
      status = `FAIL: File Missing/Empty (${resolvedAsset})`;
      failCount++;
    } else {
      passCount++;
    }

    const numStr = (idx + 1).toString().padEnd(3);
    const nameStr = r.name.slice(0, 38).padEnd(38);
    const idStr = (canonical ? canonical.id : 'UNKNOWN').padEnd(18);
    const assetStr = resolvedAsset.slice(0, 50).padEnd(50);
    const sizeStr = fileSize.toString().padStart(10) + ' B';
    const statusStr = status === 'PASS' ? '✅ VERIFIED LOCAL ASSET' : `❌ ${status}`;

    console.log(`${numStr} | ${nameStr} | ${idStr} | ${assetStr} | ${sizeStr} | ${statusStr}`);
  });

  console.log(`\n================================================================================`);
  console.log(`AUDIT RESULTS: ${passCount} VERIFIED LOCAL ASSETS / ${rows.length} TOTAL (Failures: ${failCount})`);
  console.log(`================================================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

auditLocalProduceAssets()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Audit execution error:', e);
    process.exit(1);
  });
