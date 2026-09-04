import { translations, SUPPORTED_LANGUAGES, LanguageCode } from '../translations';

console.log('\n================================================================================');
console.log('FARMER DASHBOARD 13-LANGUAGE TRANSLATION VALIDATION');
console.log('================================================================================\n');

const testKeys = [
  'farmer.addNewProduce',
  'farmer.totalCropsListed',
  'farmer.availableStock',
  'farmer.ordersToHarvest',
  'farmer.completedDeliveries',
  'farmer.speakProblem',
  'farmer.speakProblemSubtitle',
  'farmer.tapAndSpeak',
  'farmer.adviceTitle',
  'farmer.myCropsTab',
  'farmer.customerOrdersTab',
  'farmer.patronRatingsTab',
  'farmer.farmLocationTab',
  'farmer.searchCrops',
  'farmer.inStock',
  'farmer.lowStock',
  'farmer.soldOut',
  'farmer.filterAll',
  'farmer.filterInStock',
  'farmer.filterLowStock',
  'farmer.filterSoldOut',
  'farmer.noOrdersYet',
  'farmer.orderNum',
  'farmer.customer',
  'farmer.destination',
  'farmer.currentStep',
  'farmer.startHarvestBtn',
  'farmer.markDispatchedBtn',
  'common.cancel',
  'common.saveChanges',
  'common.farmerId',
  'order.placed',
  'order.harvesting',
  'order.dispatched',
  'order.delivered',
];

let allPassed = true;

SUPPORTED_LANGUAGES.forEach((lang) => {
  const dict = translations[lang.code as LanguageCode];
  let missingCount = 0;

  testKeys.forEach((k) => {
    if (!dict[k] || dict[k].trim() === '') {
      missingCount++;
      allPassed = false;
    }
  });

  const sampleAdd = dict['farmer.addNewProduce'];
  const sampleTab = dict['farmer.myCropsTab'];
  const sampleStatus = dict['order.harvesting'];

  console.log(`[${lang.code.toUpperCase().padEnd(3)}] ${lang.nativeName.padEnd(14)} (${lang.label.padEnd(12)}):`);
  console.log(`     Add Produce  -> "${sampleAdd}"`);
  console.log(`     My Crops Tab -> "${sampleTab}"`);
  console.log(`     Harvesting   -> "${sampleStatus}"`);
  console.log(`     Coverage on ${testKeys.length} critical keys: ${testKeys.length - missingCount}/${testKeys.length} (${missingCount === 0 ? '100% PASS' : 'FAIL'})\n`);
});

if (allPassed) {
  console.log('✅ ALL 13 SUPPORTED LANGUAGES PASSED 100% WITH ZERO MISSING KEYS!\n');
} else {
  console.error('❌ SOME KEYS ARE MISSING!');
  process.exit(1);
}
