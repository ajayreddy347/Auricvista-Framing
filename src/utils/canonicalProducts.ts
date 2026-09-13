/**
 * Canonical Agricultural Produce Registry for Auric Arohi
 * Maps every produce item strictly to its verified single canonical identity and local image asset.
 * Zero guessing, zero wrong-crop fallbacks, 100% locally served assets.
 */

export type CanonicalCategory =
  | 'Fruits'
  | 'Vegetables'
  | 'Spices & Seasonings'
  | 'Grains & Cereals'
  | 'Pulses & Dals'
  | 'Herbs & Leafy Greens'
  | 'Organic & Natural';

export interface CanonicalProduct {
  id: string;
  name: string;
  category: CanonicalCategory;
  aliases: string[];
  image: string;
}

export const NEUTRAL_CROP_PLACEHOLDER = '/assets/produce/neutral-placeholder.svg';

/**
 * Authoritative 1-to-1 Mapping for all 81 PostgreSQL Active Database Produce Listings
 * Every single listing is mapped to a verified, high-resolution authentic local photograph.
 */
export const DATABASE_LISTING_ASSETS: Record<
  string,
  { name: string; category: CanonicalCategory; image: string }
> = {
  // 1. Arunachalam Murugan (Tamil Nadu)
  'PROD-ARUN-01': { name: 'Pollachi Tender Green Coconut', category: 'Fruits', image: '/assets/produce/fruits/coconut.jpg' },
  'PROD-ARUN-02': { name: 'Coimbatore Fresh Moringa Drumstick', category: 'Vegetables', image: '/assets/produce/vegetables/drumstick.jpg' },
  'PROD-ARUN-03': { name: 'Ooty Sweet Orange Carrot', category: 'Vegetables', image: '/assets/produce/vegetables/carrot.jpg' },
  'PROD-ARUN-04': { name: 'Ruby Red Organic Beetroot', category: 'Vegetables', image: '/assets/produce/vegetables/beetroot.jpg' },
  'PROD-ARUN-05': { name: 'Kanyakumari Whole Cloves', category: 'Spices & Seasonings', image: '/assets/produce/spices/cloves.jpg' },
  'PROD-ARUN-06': { name: 'Salem Fresh Tapioca Roots', category: 'Vegetables', image: '/assets/produce/vegetables/tapioca.jpg' },

  // 2. Balwinder Singh (Punjab)
  'PROD-BALWINDER-01': { name: 'Sehore Sharbati Golden Wheat Grains', category: 'Grains & Cereals', image: '/assets/produce/grains/wheat.jpg' },
  'PROD-BALWINDER-02': { name: 'Traditional Long-Grain Basmati Rice', category: 'Grains & Cereals', image: '/assets/produce/grains/basmati-rice.jpg' },
  'PROD-BALWINDER-03': { name: 'Fresh Winter Mustard Greens (Sarson Ka Saag)', category: 'Herbs & Leafy Greens', image: '/assets/produce/herbs/mustard-greens.jpg' },
  'PROD-BALWINDER-04': { name: 'Crisp White Country Radish (Mooli)', category: 'Vegetables', image: '/assets/produce/vegetables/radish.jpg' },
  'PROD-BALWINDER-05': { name: 'Organic Whole Yellow Mustard Seeds', category: 'Spices & Seasonings', image: '/assets/produce/spices/mustard-seeds.jpg' },
  'PROD-BALWINDER-06': { name: 'Pure Stone-Ground Whole Wheat Atta', category: 'Grains & Cereals', image: '/assets/produce/grains/wheat.jpg' },

  // 3. Ghulam Hassan Mir (Kashmir)
  'PROD-GHULAM-01': { name: 'Pampore Mongra Grade-A1 Pure Saffron', category: 'Spices & Seasonings', image: '/assets/produce/spices/saffron.jpg' },
  'PROD-GHULAM-02': { name: 'Kashmiri Snow-White Walnut Kernels', category: 'Organic & Natural', image: '/assets/produce/organic-natural/walnut.jpg' },
  'PROD-GHULAM-03': { name: 'Kashmiri Sweet Mamra Almonds', category: 'Organic & Natural', image: '/assets/produce/organic-natural/almond.jpg' },
  'PROD-GHULAM-04': { name: 'Crisp Kashmiri Ambri Apples', category: 'Fruits', image: '/assets/produce/fruits/apple.jpg' },
  'PROD-GHULAM-05': { name: 'Sun-Dried Kashmiri Dried Apricots', category: 'Organic & Natural', image: '/assets/produce/organic-natural/apricot.jpg' },

  // 4. Gurpreet Chahal (Himachal Pradesh)
  'PROD-GURPREET-01': { name: 'Shimla Royal Delicious Apples', category: 'Fruits', image: '/assets/produce/fruits/apple.jpg' },
  'PROD-GURPREET-02': { name: 'Shimla Crisp Green Capsicum', category: 'Vegetables', image: '/assets/produce/vegetables/capsicum.jpg' },
  'PROD-GURPREET-03': { name: 'Himachal Sweet Green Peas', category: 'Vegetables', image: '/assets/produce/vegetables/peas.jpg' },
  'PROD-GURPREET-04': { name: 'Pahari Red Farm Potatoes', category: 'Vegetables', image: '/assets/produce/vegetables/potato.jpg' },
  'PROD-GURPREET-05': { name: 'Fresh Snowball Cauliflower', category: 'Vegetables', image: '/assets/produce/vegetables/cauliflower.jpg' },
  'PROD-GURPREET-06': { name: 'Jammu Chitra Red Rajma', category: 'Pulses & Dals', image: '/assets/produce/pulses/rajma.jpg' },

  // 5. Kavita Patel (Gujarat / MP border)
  'PROD-KAVITA-01': { name: 'Unjha Premium Whole Cumin Seeds', category: 'Spices & Seasonings', image: '/assets/produce/spices/cumin.jpg' },
  'PROD-KAVITA-02': { name: 'Cold-Pressed Groundnut Oil', category: 'Organic & Natural', image: '/assets/produce/organic-natural/groundnut-oil.jpg' },
  'PROD-KAVITA-03': { name: 'Mandsaur Desi White Garlic', category: 'Vegetables', image: '/assets/produce/vegetables/garlic.jpg' },
  'PROD-KAVITA-04': { name: 'Giant White Kabuli Chickpeas', category: 'Pulses & Dals', image: '/assets/produce/pulses/chickpeas.jpg' },
  'PROD-KAVITA-05': { name: 'Fragrant Green Fennel Seeds', category: 'Spices & Seasonings', image: '/assets/produce/spices/fennel-seeds.jpg' },
  'PROD-KAVITA-06': { name: 'Unpolished Desi Brown Chickpeas', category: 'Pulses & Dals', image: '/assets/produce/pulses/brown-chickpeas.jpg' },

  // 6. Lakshmi Devi (Kolar, Karnataka)
  'PROD-LAKSHMI-01': { name: 'Red Lady Honey-Sweet Papaya', category: 'Fruits', image: '/assets/produce/fruits/papaya.jpg' },
  'PROD-LAKSHMI-02': { name: 'Honey Sweet Muskmelon (Kharbuja)', category: 'Fruits', image: '/assets/produce/fruits/muskmelon.jpg' },
  'PROD-LAKSHMI-03': { name: 'Hydroponic Baby Spinach Leaves', category: 'Herbs & Leafy Greens', image: '/assets/produce/herbs/spinach.jpg' },
  'PROD-LAKSHMI-04': { name: 'Crisp Hydroponic Butterhead Lettuce', category: 'Herbs & Leafy Greens', image: '/assets/produce/herbs/lettuce.jpg' },
  'PROD-LAKSHMI-05': { name: 'Fresh Garden Peppermint (Pudina)', category: 'Herbs & Leafy Greens', image: '/assets/produce/herbs/mint.jpg' },
  'PROD-LAKSHMI-06': { name: 'Sweet Table Strawberries', category: 'Fruits', image: '/assets/produce/fruits/strawberry.jpg' },

  // 7. Mathew Joseph (Kerala)
  'PROD-MATHEW-01': { name: 'Malabar Tellicherry Bold Black Peppercorns', category: 'Spices & Seasonings', image: '/assets/produce/spices/black-pepper.jpg' },
  'PROD-MATHEW-02': { name: 'Idukki Extra Bold Green Cardamom', category: 'Spices & Seasonings', image: '/assets/produce/spices/cardamom.jpg' },
  'PROD-MATHEW-03': { name: 'Ceylon True Sweet Cinnamon Quills', category: 'Spices & Seasonings', image: '/assets/produce/spices/cinnamon.jpg' },
  'PROD-MATHEW-04': { name: 'Wayanad Fresh Rhizome Ginger', category: 'Vegetables', image: '/assets/produce/vegetables/ginger.jpg' },
  'PROD-MATHEW-05': { name: 'Extra Virgin Cold-Pressed Coconut Oil', category: 'Organic & Natural', image: '/assets/produce/organic-natural/coconut-oil.jpg' },
  'PROD-MATHEW-06': { name: 'Vazhakulam Giant Sweet Pineapples', category: 'Fruits', image: '/assets/produce/fruits/pineapple.jpg' },

  // 8. Nitin Patil (Maharashtra)
  'PROD-NITIN-01': { name: 'Ratnagiri Alphonso Mangoes', category: 'Fruits', image: '/assets/produce/fruits/mango.jpg' },
  'PROD-NITIN-02': { name: 'Dahanu Bordi Sweet Sapota (Chikoo)', category: 'Fruits', image: '/assets/produce/fruits/chikoo.jpg' },
  'PROD-NITIN-03': { name: 'Mahabaleshwar Fresh Strawberries', category: 'Fruits', image: '/assets/produce/fruits/strawberry.jpg' },
  'PROD-NITIN-04': { name: 'Konkan Sun-Dried Red Kokum Rind', category: 'Organic & Natural', image: '/assets/produce/organic-natural/kokum.jpg' },
  'PROD-NITIN-05': { name: 'Allahabad Safeda Crisp White Guava', category: 'Fruits', image: '/assets/produce/fruits/guava.jpg' },

  // 9. Pradip Deshmukh (Maharashtra)
  'PROD-PRADIP-01': { name: 'Nashik Red Storage Onions', category: 'Vegetables', image: '/assets/produce/vegetables/onion.jpg' },
  'PROD-PRADIP-02': { name: 'Nashik Black Seedless Table Grapes', category: 'Fruits', image: '/assets/produce/fruits/grapes.jpg' },
  'PROD-PRADIP-03': { name: 'Kolhapur Artisanal Sugarcane Jaggery', category: 'Organic & Natural', image: '/assets/produce/organic-natural/jaggery.jpg' },
  'PROD-PRADIP-04': { name: 'Nagpur Sweet Mandarin Oranges', category: 'Fruits', image: '/assets/produce/fruits/orange.jpg' },
  'PROD-PRADIP-05': { name: 'Bhagwa Ruby Red Pomegranates', category: 'Fruits', image: '/assets/produce/fruits/pomegranate.jpg' },
  'PROD-PRADIP-06': { name: 'Solapur White Sorghum Grain (Jowar)', category: 'Grains & Cereals', image: '/assets/produce/grains/jowar.jpg' },

  // 10. Rameshwar Lal (Rajasthan)
  'PROD-RAMESHWAR-01': { name: 'Nagaur Whole Dhaniya Seeds', category: 'Spices & Seasonings', image: '/assets/produce/spices/coriander-seeds.jpg' },
  'PROD-RAMESHWAR-02': { name: 'Organic Methi Dana (Fenugreek Seeds)', category: 'Spices & Seasonings', image: '/assets/produce/spices/fenugreek-seeds.jpg' },
  'PROD-RAMESHWAR-03': { name: 'Rajasthan Desi Pearl Millet (Bajra)', category: 'Grains & Cereals', image: '/assets/produce/grains/bajra.jpg' },
  'PROD-RAMESHWAR-04': { name: 'Split Yellow Moong Dal (Unpolished)', category: 'Pulses & Dals', image: '/assets/produce/pulses/moong-dal-yellow.jpg' },
  'PROD-RAMESHWAR-05': { name: 'Whole Green Moong (Sabut Moong)', category: 'Pulses & Dals', image: '/assets/produce/pulses/moong-dal.jpg' },
  'PROD-RAMESHWAR-06': { name: 'Marwar Desi Moth Beans (Matki)', category: 'Pulses & Dals', image: '/assets/produce/pulses/moth-beans.jpg' },

  // 11. Ravi Kumar (Karnataka)
  'PROD-RAVI-01': { name: 'Heirloom Vine Tomatoes', category: 'Vegetables', image: '/assets/produce/vegetables/tomato.jpg' },
  'PROD-RAVI-02': { name: 'Mysore Long Purple Brinjal', category: 'Vegetables', image: '/assets/produce/vegetables/brinjal.jpg' },
  'PROD-RAVI-03': { name: 'Tender Green Okra (Bhindi)', category: 'Vegetables', image: '/assets/produce/vegetables/okra.jpg' },
  'PROD-RAVI-04': { name: 'Crisp Green Country Cucumbers', category: 'Vegetables', image: '/assets/produce/vegetables/cucumber.jpg' },
  'PROD-RAVI-05': { name: 'Organic Sweet Pumpkin (Kaddu)', category: 'Vegetables', image: '/assets/produce/vegetables/pumpkin.jpg' },
  'PROD-RAVI-06': { name: 'Fragrant Country Coriander Leaves', category: 'Herbs & Leafy Greens', image: '/assets/produce/herbs/coriander-leaves.jpg' },

  // 12. Subhash Mondal (West Bengal)
  'PROD-SUBHASH-01': { name: 'Sundarbans Wild Mangrove Multi-Floral Honey', category: 'Organic & Natural', image: '/assets/produce/organic-natural/honey.jpg' },
  'PROD-SUBHASH-02': { name: 'Gobindobhog Fragrant Short-Grain Rice', category: 'Grains & Cereals', image: '/assets/produce/grains/gobindobhog-rice.jpg' },
  'PROD-SUBHASH-03': { name: 'Sundarbans Organic Black Rice', category: 'Grains & Cereals', image: '/assets/produce/grains/black-rice.jpg' },
  'PROD-SUBHASH-04': { name: 'Bengal Fresh Green Pointed Gourd', category: 'Vegetables', image: '/assets/produce/vegetables/pointed-gourd.jpg' },
  'PROD-SUBHASH-05': { name: 'Heritage Unpolished Brown Rice', category: 'Grains & Cereals', image: '/assets/produce/grains/brown-rice.jpg' },

  // 13. Suresh Naidu (Tamil Nadu / Karnataka border)
  'PROD-SURESH-01': { name: 'Mandya Whole Finger Millet (Ragi)', category: 'Grains & Cereals', image: '/assets/produce/grains/ragi.jpg' },
  'PROD-SURESH-02': { name: 'Native Foxtail Millet (Kangni / Navane)', category: 'Grains & Cereals', image: '/assets/produce/grains/foxtail-millet.jpg' },
  'PROD-SURESH-03': { name: 'Gulbarga Desi Unpolished Toor Dal', category: 'Pulses & Dals', image: '/assets/produce/pulses/toor-dal.jpg' },
  'PROD-SURESH-04': { name: 'Fresh Country Bottle Gourd (Lauki)', category: 'Vegetables', image: '/assets/produce/vegetables/bottle-gourd.jpg' },
  'PROD-SURESH-05': { name: 'Organic Tender Ridge Gourd (Turai)', category: 'Vegetables', image: '/assets/produce/vegetables/ridge-gourd.jpg' },
  'PROD-SURESH-06': { name: 'Desi Brown Horse Gram (Kulthi Dal)', category: 'Pulses & Dals', image: '/assets/produce/pulses/horse-gram.jpg' },

  // 14. Venkatesh Rao (Andhra Pradesh)
  'PROD-VENKATESH-01': { name: 'Guntur Teja Fiery Red Dry Chillies', category: 'Spices & Seasonings', image: '/assets/produce/spices/dried-red-chilli.jpg' },
  'PROD-VENKATESH-02': { name: 'Guntur Spicy Green Chillies', category: 'Vegetables', image: '/assets/produce/vegetables/green-chilli.jpg' },
  'PROD-VENKATESH-03': { name: 'Organic Fragrant Curry Leaves', category: 'Herbs & Leafy Greens', image: '/assets/produce/herbs/curry-leaves.jpg' },
  'PROD-VENKATESH-04': { name: 'Guntur Whole Black Urad Dal', category: 'Pulses & Dals', image: '/assets/produce/pulses/urad-dal-black.jpg' },
  'PROD-VENKATESH-05': { name: 'Split Washed White Urad Dal', category: 'Pulses & Dals', image: '/assets/produce/pulses/urad-dal.jpg' },
  'PROD-VENKATESH-06': { name: 'Salem & Lakadong High-Curcumin Turmeric', category: 'Spices & Seasonings', image: '/assets/produce/spices/turmeric.jpg' },
};

export const CANONICAL_PRODUCTS: CanonicalProduct[] = [
  // =========================================================================
  // 1. FRUITS
  // =========================================================================
  {
    id: 'mango',
    name: 'Alphonso Mango',
    category: 'Fruits',
    aliases: ['alphonso mango', 'dharwad alphonso', 'ratnagiri alphonso', 'alphonso', 'aam'],
    image: '/assets/produce/fruits/mango.jpg',
  },
  {
    id: 'banana',
    name: 'Fresh Banana',
    category: 'Fruits',
    aliases: ['robusta mountain banana', 'mountain banana', 'robusta banana', 'yelakki banana', 'banana', 'kela'],
    image: '/assets/produce/fruits/banana.jpg',
  },
  {
    id: 'orange',
    name: 'Mandarin Orange',
    category: 'Fruits',
    aliases: ['nagpur sweet mandarin orange', 'mandarin orange', 'nagpur orange', 'sweet orange', 'orange', 'santra'],
    image: '/assets/produce/fruits/orange.jpg',
  },
  {
    id: 'dragon-fruit',
    name: 'Red Pitaya Dragon Fruit',
    category: 'Fruits',
    aliases: ['natural red dragon fruit', 'organic heritage dragonfruit', 'heritage dragonfruit', 'red dragon fruit', 'dragon fruit', 'dragonfruit', 'pitaya'],
    image: '/assets/produce/fruits/dragon-fruit.jpg',
  },
  {
    id: 'muskmelon',
    name: 'Honey Sweet Muskmelon',
    category: 'Fruits',
    aliases: ['honey sweet muskmelon', 'honey muskmelon', 'muskmelon', 'kharbuja', 'cantaloupe'],
    image: '/assets/produce/fruits/muskmelon.jpg',
  },
  {
    id: 'pomegranate',
    name: 'Bhagwa Ruby Red Pomegranate',
    category: 'Fruits',
    aliases: ['bhagwa ruby red pomegranate', 'bhagwa pomegranate', 'ruby red pomegranate', 'pomegranate', 'anaar'],
    image: '/assets/produce/fruits/pomegranate.jpg',
  },
  {
    id: 'pineapple',
    name: 'Giant Sweet Pineapple',
    category: 'Fruits',
    aliases: ['vazhakulam giant sweet pineapple', 'vazhakulam pineapple', 'giant pineapple', 'pineapple', 'ananas'],
    image: '/assets/produce/fruits/pineapple.jpg',
  },
  {
    id: 'apple',
    name: 'Royal Delicious Apple',
    category: 'Fruits',
    aliases: ['shimla royal delicious mountain apple', 'organic golden crisp apple', 'mountain apple', 'golden crisp apple', 'apple', 'seb'],
    image: '/assets/produce/fruits/apple.jpg',
  },
  {
    id: 'papaya',
    name: 'Red Lady Papaya',
    category: 'Fruits',
    aliases: ['red lady honey-sweet papaya', 'red lady papaya', 'honey-sweet papaya', 'papaya', 'papita'],
    image: '/assets/produce/fruits/papaya.jpg',
  },
  {
    id: 'watermelon',
    name: 'Striped Watermelon',
    category: 'Fruits',
    aliases: ['sugar baby striped watermelon', 'striped watermelon', 'sugar baby watermelon', 'watermelon', 'tarbooj'],
    image: '/assets/produce/fruits/watermelon.jpg',
  },
  {
    id: 'guava',
    name: 'Crisp White Guava',
    category: 'Fruits',
    aliases: ['allahabad safeda crisp white guava', 'safeda guava', 'white guava', 'guava', 'amrud', 'amrood'],
    image: '/assets/produce/fruits/guava.jpg',
  },
  {
    id: 'grapes',
    name: 'Seedless Table Grapes',
    category: 'Fruits',
    aliases: ['nashik black seedless table grape', 'black seedless table grape', 'seedless grape', 'black grape', 'grapes', 'angoor'],
    image: '/assets/produce/fruits/grapes.jpg',
  },
  {
    id: 'coconut',
    name: 'Tender Green Coconut',
    category: 'Fruits',
    aliases: ['pollachi fresh tender green coconut', 'tender green coconut', 'green coconut', 'tender coconut', 'coconut', 'nariyal'],
    image: '/assets/produce/fruits/coconut.jpg',
  },
  {
    id: 'strawberry',
    name: 'Mahabaleshwar Strawberry',
    category: 'Fruits',
    aliases: ['mahabaleshwar fresh sweet strawberry', 'fresh sweet strawberry', 'sweet table strawberries', 'fresh strawberry', 'strawberry', 'strawberries'],
    image: '/assets/produce/fruits/strawberry.jpg',
  },
  {
    id: 'chikoo',
    name: 'Sweet Sapota (Chikoo)',
    category: 'Fruits',
    aliases: ['dahanu bordi sweet sapota', 'sweet sapota', 'sapota', 'chikoo', 'chiku', 'sapodilla'],
    image: '/assets/produce/fruits/chikoo.jpg',
  },

  // =========================================================================
  // 2. VEGETABLES
  // =========================================================================
  {
    id: 'beetroot',
    name: 'Ruby Red Beetroot',
    category: 'Vegetables',
    aliases: ['ruby red organic beetroot', 'organic beetroot', 'beetroot', 'chukandar'],
    image: '/assets/produce/vegetables/beetroot.jpg',
  },
  {
    id: 'carrot',
    name: 'Ooty Sweet Orange Carrot',
    category: 'Vegetables',
    aliases: ['ooty sweet orange carrot', 'sweet orange carrot', 'orange carrot', 'carrot', 'gajar'],
    image: '/assets/produce/vegetables/carrot.jpg',
  },
  {
    id: 'onion',
    name: 'Nashik Red Onion',
    category: 'Vegetables',
    aliases: ['nashik red storage onion', 'red storage onion', 'red onion', 'onion', 'pyaz', 'kanda'],
    image: '/assets/produce/vegetables/onion.jpg',
  },
  {
    id: 'potato',
    name: 'Pahari Red Farm Potato',
    category: 'Vegetables',
    aliases: ['pahari red farm potato', 'red farm potato', 'farm potato', 'potato', 'aloo', 'batata'],
    image: '/assets/produce/vegetables/potato.jpg',
  },
  {
    id: 'tomato',
    name: 'Heirloom Vine Tomato',
    category: 'Vegetables',
    aliases: ['heirloom vine tomato', 'vine tomato', 'tomato', 'tamatar'],
    image: '/assets/produce/vegetables/tomato.jpg',
  },
  {
    id: 'cauliflower',
    name: 'Snowball Cauliflower',
    category: 'Vegetables',
    aliases: ['fresh snowball cauliflower', 'snowball cauliflower', 'cauliflower', 'phool gobhi', 'gobhi'],
    image: '/assets/produce/vegetables/cauliflower.jpg',
  },
  {
    id: 'cabbage',
    name: 'Crisp Green Cabbage',
    category: 'Vegetables',
    aliases: ['crisp green drumhead cabbage', 'green drumhead cabbage', 'green cabbage', 'cabbage', 'patta gobhi'],
    image: '/assets/produce/vegetables/cabbage.jpg',
  },
  {
    id: 'capsicum',
    name: 'Shimla Green Capsicum',
    category: 'Vegetables',
    aliases: ['shimla crisp green capsicum', 'crisp green capsicum', 'green capsicum', 'capsicum', 'shimla mirch', 'bell pepper'],
    image: '/assets/produce/vegetables/capsicum.jpg',
  },
  {
    id: 'green-chilli',
    name: 'Spicy Green Chilli',
    category: 'Vegetables',
    aliases: ['guntur spicy green chilli', 'spicy green chilli', 'green chilli', 'green chillies', 'mirchi', 'hari mirch'],
    image: '/assets/produce/vegetables/green-chilli.jpg',
  },
  {
    id: 'brinjal',
    name: 'Mysore Purple Brinjal',
    category: 'Vegetables',
    aliases: ['mysore long purple brinjal', 'long purple brinjal', 'purple brinjal', 'brinjal', 'baingan', 'eggplant', 'aubergine'],
    image: '/assets/produce/vegetables/brinjal.jpg',
  },
  {
    id: 'okra',
    name: 'Tender Green Okra (Bhindi)',
    category: 'Vegetables',
    aliases: ['tender green okra bhindi', 'tender green okra', 'okra bhindi', 'green okra', 'okra', 'bhindi', 'ladies finger'],
    image: '/assets/produce/vegetables/okra.jpg',
  },
  {
    id: 'cucumber',
    name: 'Country Cucumber',
    category: 'Vegetables',
    aliases: ['crisp green country cucumber', 'green country cucumber', 'country cucumber', 'cucumber', 'kheera', 'kakdi'],
    image: '/assets/produce/vegetables/cucumber.jpg',
  },
  {
    id: 'bottle-gourd',
    name: 'Country Bottle Gourd (Lauki)',
    category: 'Vegetables',
    aliases: ['fresh country bottle gourd lauki', 'country bottle gourd', 'bottle gourd', 'lauki', 'doodhi'],
    image: '/assets/produce/vegetables/bottle-gourd.jpg',
  },
  {
    id: 'ridge-gourd',
    name: 'Tender Ridge Gourd (Turai)',
    category: 'Vegetables',
    aliases: ['organic tender ridge gourd', 'tender ridge gourd', 'ridge gourd', 'turai', 'torai'],
    image: '/assets/produce/vegetables/ridge-gourd.jpg',
  },
  {
    id: 'pointed-gourd',
    name: 'Bengal Green Pointed Gourd (Parwal)',
    category: 'Vegetables',
    aliases: ['bengal fresh green pointed gourd', 'fresh green pointed gourd', 'pointed gourd', 'parwal', 'potol'],
    image: '/assets/produce/vegetables/pointed-gourd.jpg',
  },
  {
    id: 'pumpkin',
    name: 'Organic Sweet Pumpkin (Kaddu)',
    category: 'Vegetables',
    aliases: ['organic sweet pumpkin kaddu', 'sweet pumpkin', 'organic pumpkin', 'pumpkin', 'kaddu', 'sitaphal'],
    image: '/assets/produce/vegetables/pumpkin.jpg',
  },
  {
    id: 'radish',
    name: 'Crisp White Country Radish (Mooli)',
    category: 'Vegetables',
    aliases: ['crisp white country radish mooli', 'crisp white country radish', 'white country radish', 'white radish', 'radish', 'mooli'],
    image: '/assets/produce/vegetables/radish.jpg',
  },
  {
    id: 'tapioca',
    name: 'Salem Fresh Tapioca Roots',
    category: 'Vegetables',
    aliases: ['salem fresh tapioca roots', 'fresh tapioca roots', 'tapioca roots', 'tapioca', 'maravalli kizhangu', 'cassava'],
    image: '/assets/produce/vegetables/tapioca.jpg',
  },
  {
    id: 'peas',
    name: 'Sweet Green Peas',
    category: 'Vegetables',
    aliases: ['himachal sweet green peas', 'sweet green peas', 'green peas', 'fresh peas', 'peas', 'matar'],
    image: '/assets/produce/vegetables/peas.jpg',
  },
  {
    id: 'drumstick',
    name: 'Fresh Moringa Drumstick',
    category: 'Vegetables',
    aliases: ['coimbatore fresh moringa drumstick', 'fresh moringa drumstick', 'moringa drumstick', 'drumstick', 'sahjan', 'murungakkai'],
    image: '/assets/produce/vegetables/drumstick.jpg',
  },
  {
    id: 'garlic',
    name: 'Desi White Garlic',
    category: 'Vegetables',
    aliases: ['mandsaur desi white garlic', 'desi white garlic', 'white garlic', 'garlic', 'lahsun', 'lasun'],
    image: '/assets/produce/vegetables/garlic.jpg',
  },
  {
    id: 'ginger',
    name: 'Fresh Rhizome Ginger',
    category: 'Vegetables',
    aliases: ['wayanad fresh rhizome ginger', 'fresh rhizome ginger', 'fresh ginger', 'ginger', 'adrak', 'inji'],
    image: '/assets/produce/vegetables/ginger.jpg',
  },

  // =========================================================================
  // 3. SPICES & SEASONINGS
  // =========================================================================
  {
    id: 'turmeric',
    name: 'High-Curcumin Turmeric',
    category: 'Spices & Seasonings',
    aliases: ['salem lakadong highcurcumin turmeric', 'high curcumin turmeric', 'curcumin turmeric', 'turmeric finger', 'turmeric', 'haldi'],
    image: '/assets/produce/spices/turmeric.jpg',
  },
  {
    id: 'cloves',
    name: 'Kanyakumari Whole Cloves',
    category: 'Spices & Seasonings',
    aliases: ['kanyakumari whole cloves', 'whole cloves', 'cloves', 'laung', 'lavang'],
    image: '/assets/produce/spices/cloves.jpg',
  },
  {
    id: 'black-pepper',
    name: 'Tellicherry Bold Black Pepper',
    category: 'Spices & Seasonings',
    aliases: ['malabar tellicherry bold black peppercorn', 'tellicherry bold black peppercorn', 'tellicherry black pepper', 'black pepper', 'kali mirch'],
    image: '/assets/produce/spices/black-pepper.jpg',
  },
  {
    id: 'cardamom',
    name: 'Idukki Extra Bold Cardamom',
    category: 'Spices & Seasonings',
    aliases: ['idukki extra bold green cardamom', 'extra bold green cardamom', 'green cardamom', 'cardamom', 'elaichi', 'chhoti elaichi'],
    image: '/assets/produce/spices/cardamom.jpg',
  },
  {
    id: 'cinnamon',
    name: 'Ceylon True Sweet Cinnamon Quills',
    category: 'Spices & Seasonings',
    aliases: ['ceylon true sweet cinnamon quill', 'true sweet cinnamon quill', 'sweet cinnamon quill', 'cinnamon quill', 'cinnamon', 'dalchini'],
    image: '/assets/produce/spices/cinnamon.jpg',
  },
  {
    id: 'cumin',
    name: 'Unjha Whole Cumin Seeds',
    category: 'Spices & Seasonings',
    aliases: ['unjha premium whole cumin seed', 'premium whole cumin seed', 'whole cumin seed', 'cumin seed', 'cumin', 'jeera'],
    image: '/assets/produce/spices/cumin.jpg',
  },
  {
    id: 'coriander-seeds',
    name: 'Whole Dhaniya Seeds',
    category: 'Spices & Seasonings',
    aliases: ['nagaur whole dhaniya seed', 'whole dhaniya seed', 'coriander seed', 'dhaniya seed', 'dhaniya beej', 'whole coriander'],
    image: '/assets/produce/spices/coriander-seeds.jpg',
  },
  {
    id: 'fennel-seeds',
    name: 'Fragrant Green Fennel Seeds',
    category: 'Spices & Seasonings',
    aliases: ['fragrant green fennel seed', 'green fennel seed', 'fennel seed', 'saunf', 'variyali'],
    image: '/assets/produce/spices/fennel-seeds.jpg',
  },
  {
    id: 'fenugreek-seeds',
    name: 'Organic Methi Dana (Fenugreek Seeds)',
    category: 'Spices & Seasonings',
    aliases: ['organic methi dana fenugreek seed', 'methi dana fenugreek seed', 'organic methi dana', 'methi dana', 'fenugreek seed', 'methi seed'],
    image: '/assets/produce/spices/fenugreek-seeds.jpg',
  },
  {
    id: 'mustard-seeds',
    name: 'Organic Whole Yellow Mustard Seeds',
    category: 'Spices & Seasonings',
    aliases: ['organic whole yellow mustard seed', 'yellow mustard seed', 'mustard seed', 'sarson dana', 'sarson beej', 'rai'],
    image: '/assets/produce/spices/mustard-seeds.jpg',
  },
  {
    id: 'dried-red-chilli',
    name: 'Guntur Teja Dry Red Chilli',
    category: 'Spices & Seasonings',
    aliases: ['guntur teja fiery red dry chilli', 'fiery red dry chilli', 'dry red chilli', 'red dry chilli', 'dried red chilli', 'lal mirch'],
    image: '/assets/produce/spices/dried-red-chilli.jpg',
  },
  {
    id: 'saffron',
    name: 'Pampore Pure Mongra Saffron',
    category: 'Spices & Seasonings',
    aliases: ['pampore mongra gradea1 pure saffron', 'gradea1 pure saffron', 'mongra saffron', 'pure saffron', 'saffron', 'kesar', 'zafran'],
    image: '/assets/produce/spices/saffron.jpg',
  },

  // =========================================================================
  // 4. GRAINS & CEREALS
  // =========================================================================
  {
    id: 'basmati-rice',
    name: 'Long-Grain Basmati Rice',
    category: 'Grains & Cereals',
    aliases: ['traditional long-grain basmati rice', 'long-grain basmati rice', 'basmati rice', 'basmati', 'chawal'],
    image: '/assets/produce/grains/basmati-rice.jpg',
  },
  {
    id: 'gobindobhog-rice',
    name: 'Gobindobhog Fragrant Short-Grain Rice',
    category: 'Grains & Cereals',
    aliases: ['gobindobhog fragrant shortgrain rice', 'gobindobhog rice', 'gobindobhog chawal', 'gobindobhog'],
    image: '/assets/produce/grains/gobindobhog-rice.jpg',
  },
  {
    id: 'black-rice',
    name: 'Sundarbans Organic Black Rice',
    category: 'Grains & Cereals',
    aliases: ['sundarbans organic black rice', 'organic black rice', 'black rice', 'kala bhat', 'chak hao'],
    image: '/assets/produce/grains/black-rice.jpg',
  },
  {
    id: 'brown-rice',
    name: 'Heritage Unpolished Brown Rice',
    category: 'Grains & Cereals',
    aliases: ['heritage unpolished brown rice', 'unpolished brown rice', 'brown rice', 'dheki chhata chawal', 'dheki chhata'],
    image: '/assets/produce/grains/brown-rice.jpg',
  },
  {
    id: 'sona-masoori-rice',
    name: 'Sona Masoori Raw Rice',
    category: 'Grains & Cereals',
    aliases: ['andhra sona masoori raw rice', 'sona masoori raw rice', 'sona masoori rice', 'sona masoori', 'masoori rice'],
    image: '/assets/produce/grains/sona-masoori-rice.jpg',
  },
  {
    id: 'wheat',
    name: 'Sharbati Whole Wheat',
    category: 'Grains & Cereals',
    aliases: ['sehore sharbati golden wheat grain', 'sharbati golden wheat grain', 'sharbati wheat', 'golden wheat', 'wheat grain', 'whole wheat atta', 'wheat atta', 'wheat', 'gehu'],
    image: '/assets/produce/grains/wheat.jpg',
  },
  {
    id: 'ragi',
    name: 'Whole Finger Millet (Ragi)',
    category: 'Grains & Cereals',
    aliases: ['mandya whole finger millet ragi', 'whole finger millet ragi', 'finger millet ragi', 'finger millet', 'ragi grain', 'ragi', 'nachni', 'kezhvaragu'],
    image: '/assets/produce/grains/ragi.jpg',
  },
  {
    id: 'bajra',
    name: 'Pearl Millet (Bajra)',
    category: 'Grains & Cereals',
    aliases: ['rajasthan desi pearl millet bajra', 'desi pearl millet bajra', 'pearl millet bajra', 'pearl millet', 'bajra grain', 'bajra', 'kambu', 'sajje'],
    image: '/assets/produce/grains/bajra.jpg',
  },
  {
    id: 'jowar',
    name: 'Sorghum Grain (Jowar)',
    category: 'Grains & Cereals',
    aliases: ['solapur white sorghum grain jowar', 'white sorghum grain jowar', 'sorghum grain jowar', 'sorghum grain', 'jowar grain', 'jowar', 'cholam', 'jonna'],
    image: '/assets/produce/grains/jowar.jpg',
  },
  {
    id: 'foxtail-millet',
    name: 'Native Foxtail Millet (Kangni)',
    category: 'Grains & Cereals',
    aliases: ['native foxtail millet kangni navane', 'foxtail millet kangni', 'foxtail millet', 'kangni', 'navane', 'thinai'],
    image: '/assets/produce/grains/foxtail-millet.jpg',
  },

  // =========================================================================
  // 5. PULSES & DALS
  // =========================================================================
  {
    id: 'rajma',
    name: 'Jammu Chitra Red Rajma',
    category: 'Pulses & Dals',
    aliases: ['jammu chitra red rajma', 'chitra red rajma', 'red rajma', 'rajma', 'kidney beans'],
    image: '/assets/produce/pulses/rajma.jpg',
  },
  {
    id: 'chickpeas',
    name: 'Giant White Kabuli Chickpeas',
    category: 'Pulses & Dals',
    aliases: ['giant white kabuli chickpeas', 'white kabuli chickpeas', 'kabuli chickpeas', 'kabuli chana', 'chickpeas', 'safed chana', 'garbanzo'],
    image: '/assets/produce/pulses/chickpeas.jpg',
  },
  {
    id: 'kala-chana',
    name: 'Unpolished Desi Brown Chickpeas',
    category: 'Pulses & Dals',
    aliases: ['unpolished desi brown chickpeas', 'desi brown chickpeas', 'brown chickpeas', 'kala chana', 'desi chana'],
    image: '/assets/produce/pulses/brown-chickpeas.jpg',
  },
  {
    id: 'toor-dal',
    name: 'Unpolished Toor Dal',
    category: 'Pulses & Dals',
    aliases: ['gulbarga desi unpolished toor dal', 'desi unpolished toor dal', 'unpolished toor dal', 'toor dal', 'arhar dal', 'pigeon pea', 'tuvar dal'],
    image: '/assets/produce/pulses/toor-dal.jpg',
  },
  {
    id: 'moong-dal',
    name: 'Whole Green Moong (Sabut Moong)',
    category: 'Pulses & Dals',
    aliases: ['whole green moong sabut moong', 'whole green moong', 'sabut moong', 'green moong dal', 'green gram', 'moong'],
    image: '/assets/produce/pulses/moong-dal.jpg',
  },
  {
    id: 'moong-dal-yellow',
    name: 'Split Yellow Moong Dal (Unpolished)',
    category: 'Pulses & Dals',
    aliases: ['split yellow moong dal unpolished', 'split yellow moong dal', 'yellow moong dal', 'dhuli moong'],
    image: '/assets/produce/pulses/moong-dal-yellow.jpg',
  },
  {
    id: 'moth-beans',
    name: 'Marwar Desi Moth Beans (Matki)',
    category: 'Pulses & Dals',
    aliases: ['marwar desi moth beans matki', 'desi moth beans matki', 'desi moth beans', 'moth beans', 'matki'],
    image: '/assets/produce/pulses/moth-beans.jpg',
  },
  {
    id: 'horse-gram',
    name: 'Desi Brown Horse Gram (Kulthi Dal)',
    category: 'Pulses & Dals',
    aliases: ['desi brown horse gram kulthi dal', 'brown horse gram kulthi dal', 'brown horse gram', 'horse gram', 'kulthi dal', 'kollu'],
    image: '/assets/produce/pulses/horse-gram.jpg',
  },
  {
    id: 'urad-dal',
    name: 'Split Washed White Urad Dal',
    category: 'Pulses & Dals',
    aliases: ['split washed white urad dal', 'washed white urad dal', 'white urad dal', 'split urad dal', 'urad dal', 'dhuli urad'],
    image: '/assets/produce/pulses/urad-dal.jpg',
  },
  {
    id: 'urad-dal-black',
    name: 'Guntur Whole Black Urad Dal',
    category: 'Pulses & Dals',
    aliases: ['guntur whole black urad dal', 'whole black urad dal', 'black urad dal', 'sabut urad', 'urad whole'],
    image: '/assets/produce/pulses/urad-dal-black.jpg',
  },

  // =========================================================================
  // 6. HERBS & LEAFY GREENS
  // =========================================================================
  {
    id: 'mustard-greens',
    name: 'Fresh Winter Mustard Greens (Sarson Ka Saag)',
    category: 'Herbs & Leafy Greens',
    aliases: ['fresh winter mustard greens sarson ka saag', 'fresh winter mustard greens', 'sarson ka saag', 'mustard greens', 'sarson saag'],
    image: '/assets/produce/herbs/mustard-greens.jpg',
  },
  {
    id: 'spinach',
    name: 'Hydroponic Baby Spinach Leaves',
    category: 'Herbs & Leafy Greens',
    aliases: ['hydroponic baby spinach leaf', 'baby spinach leaf', 'spinach leaf', 'fresh spinach', 'spinach', 'palak'],
    image: '/assets/produce/herbs/spinach.jpg',
  },
  {
    id: 'coriander-leaves',
    name: 'Fragrant Country Coriander Leaves',
    category: 'Herbs & Leafy Greens',
    aliases: ['fragrant country coriander leaf', 'country coriander leaf', 'fresh coriander leaf', 'coriander leaf', 'coriander leaves', 'dhaniya patta', 'hara dhaniya', 'cilantro'],
    image: '/assets/produce/herbs/coriander-leaves.jpg',
  },
  {
    id: 'mint',
    name: 'Fresh Garden Peppermint (Pudina)',
    category: 'Herbs & Leafy Greens',
    aliases: ['fresh garden peppermint pudina', 'garden peppermint', 'pudina leaf', 'peppermint', 'mint leaf', 'mint', 'pudina'],
    image: '/assets/produce/herbs/mint.jpg',
  },
  {
    id: 'curry-leaves',
    name: 'Organic Fragrant Curry Leaves',
    category: 'Herbs & Leafy Greens',
    aliases: ['organic fragrant curry leaf', 'fragrant curry leaf', 'curry leaf', 'curry leaves', 'kadi patta', 'karivepaku'],
    image: '/assets/produce/herbs/curry-leaves.jpg',
  },
  {
    id: 'lettuce',
    name: 'Crisp Hydroponic Butterhead Lettuce',
    category: 'Herbs & Leafy Greens',
    aliases: ['crisp hydroponic butterhead salad lettuce', 'butterhead salad lettuce', 'salad lettuce', 'butterhead lettuce', 'lettuce'],
    image: '/assets/produce/herbs/lettuce.jpg',
  },

  // =========================================================================
  // 7. ORGANIC & NATURAL
  // =========================================================================
  {
    id: 'kokum',
    name: 'Konkan Sun-Dried Red Kokum Rind',
    category: 'Organic & Natural',
    aliases: ['konkan sundried red kokum rind', 'sundried red kokum rind', 'red kokum rind', 'kokum rind', 'kokum', 'aamsul'],
    image: '/assets/produce/organic-natural/kokum.jpg',
  },
  {
    id: 'coconut-oil',
    name: 'Cold-Pressed Coconut Oil',
    category: 'Organic & Natural',
    aliases: ['extra virgin coldpressed coconut oil', 'coldpressed coconut oil', 'virgin coconut oil', 'marachekku coconut oil', 'coconut oil'],
    image: '/assets/produce/organic-natural/coconut-oil.jpg',
  },
  {
    id: 'jaggery',
    name: 'Artisanal Sugarcane Jaggery',
    category: 'Organic & Natural',
    aliases: ['kolhapur artisanal sugarcane jaggery', 'organic sugarcane jaggery', 'sugarcane jaggery', 'artisanal jaggery', 'organic gur', 'jaggery', 'gur'],
    image: '/assets/produce/organic-natural/jaggery.jpg',
  },
  {
    id: 'honey',
    name: 'Multi-Floral Raw Honey',
    category: 'Organic & Natural',
    aliases: ['sundarbans wild mangrove multifloral raw honey', 'wild mangrove raw honey', 'multifloral raw honey', 'raw honey', 'honey', 'shahad'],
    image: '/assets/produce/organic-natural/honey.jpg',
  },
  {
    id: 'groundnut-oil',
    name: 'Cold-Pressed Groundnut Oil',
    category: 'Organic & Natural',
    aliases: ['coldpressed groundnut oil', 'woodpressed kacchi ghani', 'groundnut oil', 'peanut oil', 'kacchi ghani'],
    image: '/assets/produce/organic-natural/groundnut-oil.jpg',
  },
  {
    id: 'walnut',
    name: 'Kashmiri Walnut Kernels',
    category: 'Organic & Natural',
    aliases: ['kashmiri snowwhite walnut kernel', 'snowwhite walnut kernel', 'walnut kernel', 'walnut', 'akhrot giri', 'akhrot'],
    image: '/assets/produce/organic-natural/walnut.jpg',
  },
  {
    id: 'almond',
    name: 'Kashmiri Mamra Almonds',
    category: 'Organic & Natural',
    aliases: ['kashmiri sweet mamra almond badam giri', 'mamra almond', 'sweet almond', 'badam giri', 'almond', 'badam'],
    image: '/assets/produce/organic-natural/almond.jpg',
  },
  {
    id: 'apricot',
    name: 'Dried Kashmiri Apricots',
    category: 'Organic & Natural',
    aliases: ['sundried kashmiri dried apricot khubani', 'kashmiri dried apricot', 'dried apricot', 'apricot', 'khubani'],
    image: '/assets/produce/organic-natural/apricot.jpg',
  },
];

// Pre-compute alias index sorted by alias string length descending (longest, most specific match first)
interface AliasEntry {
  aliasNormalized: string;
  product: CanonicalProduct;
}

const ALIAS_INDEX: AliasEntry[] = CANONICAL_PRODUCTS.flatMap((p) =>
  p.aliases.map((alias) => ({
    aliasNormalized: alias.toLowerCase().replace(/[^a-z0-9]/g, ''),
    product: p,
  }))
).sort((a, b) => b.aliasNormalized.length - a.aliasNormalized.length);

/**
 * Normalizes any crop name or produce listing into its single authoritative Canonical Product.
 * Priority 1: Exact Database Product ID (e.g. 'PROD-ARUN-01', 'PROD-VENKATESH-06')
 * Priority 2: Negative-filter-safe alias matching
 * Priority 3: Longest alias matching
 */
export function getCanonicalProduct(
  nameOrProduce?: string | { id?: string; name?: string; category?: string } | null
): CanonicalProduct | null {
  if (!nameOrProduce) return null;

  // 1. Direct match by Database Product ID (100% deterministic for all 81 listings)
  if (typeof nameOrProduce === 'object' && nameOrProduce.id) {
    const directDb = DATABASE_LISTING_ASSETS[nameOrProduce.id];
    if (directDb) {
      return {
        id: nameOrProduce.id,
        name: directDb.name,
        category: directDb.category,
        aliases: [directDb.name.toLowerCase()],
        image: directDb.image,
      };
    }
  }

  const rawName = typeof nameOrProduce === 'string' ? nameOrProduce : nameOrProduce.name || '';
  const normalized = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (!normalized) return null;

  // Negative safety rules to prevent cross-crop false positives:
  // - "kokum" / "aamsul" must NOT match "mango" / "aam"
  if (normalized.includes('kokum') || normalized.includes('aamsul')) {
    return {
      id: 'kokum',
      name: 'Konkan Sun-Dried Red Kokum Rind',
      category: 'Organic & Natural',
      aliases: ['kokum', 'aamsul'],
      image: '/assets/produce/organic-natural/kokum.jpg',
    };
  }

  // - "gobindobhog" must NOT match "cauliflower" / "gobhi"
  if (normalized.includes('gobindobhog')) {
    return {
      id: 'gobindobhog-rice',
      name: 'Gobindobhog Fragrant Short-Grain Rice',
      category: 'Grains & Cereals',
      aliases: ['gobindobhog'],
      image: '/assets/produce/grains/gobindobhog-rice.jpg',
    };
  }

  // - "coriander seed" must NOT match "coriander leaf"
  if (normalized.includes('corianderseed') || normalized.includes('dhaniyaseed') || normalized.includes('wholedhaniya')) {
    return {
      id: 'coriander-seeds',
      name: 'Whole Dhaniya Seeds',
      category: 'Spices & Seasonings',
      aliases: ['dhaniya seed', 'coriander seed'],
      image: '/assets/produce/spices/coriander-seeds.jpg',
    };
  }

  // - "methi dana" / "fenugreek seed" must NOT match "fenugreek leaf"
  if (normalized.includes('methidana') || normalized.includes('fenugreekseed')) {
    return {
      id: 'fenugreek-seeds',
      name: 'Organic Methi Dana (Fenugreek Seeds)',
      category: 'Spices & Seasonings',
      aliases: ['methi dana', 'fenugreek seeds'],
      image: '/assets/produce/spices/fenugreek-seeds.jpg',
    };
  }

  // - "mustard seed" must NOT match "mustard greens"
  if (normalized.includes('mustardseed') || normalized.includes('sarsondana') || normalized.includes('rai')) {
    return {
      id: 'mustard-seeds',
      name: 'Organic Whole Yellow Mustard Seeds',
      category: 'Spices & Seasonings',
      aliases: ['mustard seeds', 'yellow mustard seeds'],
      image: '/assets/produce/spices/mustard-seeds.jpg',
    };
  }

  if (normalized.includes('sarsonka') || normalized.includes('mustardgreen') || normalized.includes('sarsonsaag')) {
    return {
      id: 'mustard-greens',
      name: 'Fresh Winter Mustard Greens (Sarson Ka Saag)',
      category: 'Herbs & Leafy Greens',
      aliases: ['sarson ka saag', 'mustard greens'],
      image: '/assets/produce/herbs/mustard-greens.jpg',
    };
  }

  if (normalized.includes('blackrice') || normalized.includes('kalabhat')) {
    return {
      id: 'black-rice',
      name: 'Sundarbans Organic Black Rice',
      category: 'Grains & Cereals',
      aliases: ['black rice', 'kala bhat'],
      image: '/assets/produce/grains/black-rice.jpg',
    };
  }

  if (normalized.includes('parwal') || normalized.includes('potol') || normalized.includes('pointedgourd')) {
    return {
      id: 'pointed-gourd',
      name: 'Bengal Fresh Green Pointed Gourd',
      category: 'Vegetables',
      aliases: ['parwal', 'potol'],
      image: '/assets/produce/vegetables/pointed-gourd.jpg',
    };
  }

  if (normalized.includes('kalachana') || normalized.includes('brownchickpea')) {
    return {
      id: 'kala-chana',
      name: 'Unpolished Desi Brown Chickpeas',
      category: 'Pulses & Dals',
      aliases: ['kala chana', 'brown chickpeas'],
      image: '/assets/produce/pulses/brown-chickpeas.jpg',
    };
  }

  if (normalized.includes('dhekichhata') || normalized.includes('brownrice')) {
    return {
      id: 'brown-rice',
      name: 'Heritage Unpolished Brown Rice',
      category: 'Grains & Cereals',
      aliases: ['brown rice', 'dheki chhata'],
      image: '/assets/produce/grains/brown-rice.jpg',
    };
  }

  if (normalized.includes('guava') || normalized.includes('amrood') || normalized.includes('safeda')) {
    return {
      id: 'guava',
      name: 'Allahabad Safeda Crisp White Guava',
      category: 'Fruits',
      aliases: ['allahabad safeda crisp white guava', 'safeda guava', 'white guava', 'guava', 'amrood'],
      image: '/assets/produce/fruits/guava.jpg',
    };
  }

  // 3. Longest alias match
  for (const entry of ALIAS_INDEX) {
    if (normalized.includes(entry.aliasNormalized)) {
      return entry.product;
    }
  }

  return null;
}
