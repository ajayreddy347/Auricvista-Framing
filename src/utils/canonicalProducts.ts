/**
 * Canonical Agricultural Produce Registry for Auric Arohi
 * Maps every produce name strictly to its verified single canonical identity and local image asset.
 * Zero guessing, zero wrong-crop fallbacks, 100% locally served assets.
 */

export interface CanonicalProduct {
  id: string;
  name: string;
  category: 'Fruits' | 'Vegetables' | 'Spices & Seasonings' | 'Grains & Cereals' | 'Pulses & Dals' | 'Herbs & Leafy Greens' | 'Organic & Natural';
  aliases: string[];
  image: string;
}

export const CANONICAL_PRODUCTS: CanonicalProduct[] = [
  // =========================================================================
  // 1. FRUITS
  // =========================================================================
  {
    id: 'mango',
    name: 'Alphonso Mango',
    category: 'Fruits',
    aliases: ['alphonso mango', 'dharwad alphonso', 'ratnagiri alphonso', 'alphonso', 'mango', 'aam'],
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
    aliases: ['honey sweet muskmelon', 'honey muskmelon', 'muskmelon', 'kharbuja', 'cantaloupe', 'honeydew'],
    image: '/assets/produce/fruits/muskmelon.jpg',
  },
  {
    id: 'pomegranate',
    name: 'Bhagwa Ruby Red Pomegranate',
    category: 'Fruits',
    aliases: ['bhagwa ruby red pomegranate', 'bhagwa pomegranate', 'ruby red pomegranate', 'pomegranate', 'anaar', 'anar'],
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
    aliases: ['allahabad safeda crisp white guava', 'safeda guava', 'white guava', 'guava', 'amrud'],
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
    id: 'custard-apple',
    name: 'Sweet Custard Apple',
    category: 'Fruits',
    aliases: ['balanagar sweet custard apple', 'sweet custard apple', 'custard apple', 'seethaphal', 'sitaphal'],
    image: '/assets/produce/fruits/custard-apple.jpg',
  },
  {
    id: 'coconut',
    name: 'Tender Green Coconut',
    category: 'Fruits',
    aliases: ['pollachi fresh tender green coconut', 'tender green coconut', 'green coconut', 'tender coconut', 'coconut', 'nariyal'],
    image: '/assets/produce/fruits/coconut.jpg',
  },
  {
    id: 'lemon',
    name: 'Juicy Yellow Lemon',
    category: 'Fruits',
    aliases: ['kagzi thin-skin fresh juicy lemon', 'thin-skin lemon', 'juicy lemon', 'lemon', 'nimboo', 'nimbu'],
    image: '/assets/produce/fruits/lemon.jpg',
  },
  {
    id: 'strawberry',
    name: 'Mahabaleshwar Strawberry',
    category: 'Fruits',
    aliases: ['mahabaleshwar fresh sweet strawberry', 'fresh sweet strawberry', 'sweet strawberry', 'strawberries', 'strawberry'],
    image: '/assets/produce/fruits/strawberry.jpg',
  },

  // =========================================================================
  // 2. VEGETABLES
  // =========================================================================
  {
    id: 'bitter-gourd',
    name: 'Organic Bitter Gourd (Karela)',
    category: 'Vegetables',
    aliases: ['organic bitter gourd', 'bitter gourd', 'karela'],
    image: '/assets/produce/vegetables/bitter-gourd.jpg',
  },
  {
    id: 'beetroot',
    name: 'Organic Red Beetroot',
    category: 'Vegetables',
    aliases: ['ruby red organic beetroot', 'organic beetroot', 'red beetroot', 'beetroot', 'chukandar'],
    image: '/assets/produce/vegetables/beetroot.jpg',
  },
  {
    id: 'carrot',
    name: 'Fresh Orange & Rainbow Carrots',
    category: 'Vegetables',
    aliases: ['ooty sweet orange carrot', 'heritage rainbow carrot', 'sweet orange carrot', 'rainbow carrot', 'orange carrot', 'carrot', 'gajar'],
    image: '/assets/produce/vegetables/carrot.jpg',
  },
  {
    id: 'onion',
    name: 'Nashik Red Onion',
    category: 'Vegetables',
    aliases: ['nashik red storage onion', 'red storage onion', 'red onion', 'onion', 'pyaz', 'pyaaz'],
    image: '/assets/produce/vegetables/onion.jpg',
  },
  {
    id: 'potato',
    name: 'Pahari Farm Potato',
    category: 'Vegetables',
    aliases: ['pahari red farm potato', 'red farm potato', 'farm potato', 'potato', 'aloo', 'alu'],
    image: '/assets/produce/vegetables/potato.jpg',
  },
  {
    id: 'tomato',
    name: 'Heirloom Vine Tomato',
    category: 'Vegetables',
    aliases: ['heirloom vine tomato', 'vine tomato', 'heirloom tomato', 'tomato', 'tamatar'],
    image: '/assets/produce/vegetables/tomato.jpg',
  },
  {
    id: 'cauliflower',
    name: 'Snowball Cauliflower',
    category: 'Vegetables',
    aliases: ['fresh snowball cauliflower', 'snowball cauliflower', 'cauliflower', 'phoolgobhi', 'gobi'],
    image: '/assets/produce/vegetables/cauliflower.jpg',
  },
  {
    id: 'cabbage',
    name: 'Green Mountain Cabbage',
    category: 'Vegetables',
    aliases: ['crisp green mountain cabbage', 'green mountain cabbage', 'mountain cabbage', 'cabbage', 'pattagobhi', 'patta gobi'],
    image: '/assets/produce/vegetables/cabbage.jpg',
  },
  {
    id: 'capsicum',
    name: 'Crisp Green Capsicum',
    category: 'Vegetables',
    aliases: ['shimla crisp green capsicum', 'crisp green capsicum', 'bell pepper', 'green capsicum', 'capsicum', 'shimla mirch'],
    image: '/assets/produce/vegetables/capsicum.jpg',
  },
  {
    id: 'green-chilli',
    name: 'Guntur Spicy Green Chilli',
    category: 'Vegetables',
    aliases: ['guntur spicy green chilli', 'spicy green chilli', 'green chilli', 'green chillies', 'hari mirch', 'mirchi'],
    image: '/assets/produce/vegetables/green-chilli.jpg',
  },
  {
    id: 'brinjal',
    name: 'Long Purple Brinjal',
    category: 'Vegetables',
    aliases: ['mysore long purple brinjal', 'long purple brinjal', 'purple brinjal', 'brinjal', 'eggplant', 'baingan'],
    image: '/assets/produce/vegetables/brinjal.jpg',
  },
  {
    id: 'okra',
    name: 'Tender Green Okra (Bhindi)',
    category: 'Vegetables',
    aliases: ['tender green okra', 'ladies finger', 'lady finger', 'green okra', 'okra', 'bhindi'],
    image: '/assets/produce/vegetables/okra.jpg',
  },
  {
    id: 'cucumber',
    name: 'Country Cucumber',
    category: 'Vegetables',
    aliases: ['crisp green country cucumber', 'green country cucumber', 'country cucumber', 'cucumber', 'kheera'],
    image: '/assets/produce/vegetables/cucumber.jpg',
  },
  {
    id: 'bottle-gourd',
    name: 'Country Bottle Gourd',
    category: 'Vegetables',
    aliases: ['fresh country bottle gourd', 'country bottle gourd', 'bottle gourd', 'lauki', 'doodhi'],
    image: '/assets/produce/vegetables/bottle-gourd.jpg',
  },
  {
    id: 'peas',
    name: 'Sweet Green Peas',
    category: 'Vegetables',
    aliases: ['himachal sweet green pea', 'sweet green pea', 'matar in pod', 'green peas', 'green pea', 'peas', 'matar'],
    image: '/assets/produce/vegetables/peas.jpg',
  },
  {
    id: 'drumstick',
    name: 'Fresh Moringa Drumstick',
    category: 'Vegetables',
    aliases: ['coimbatore fresh moringa drumstick', 'fresh moringa drumstick', 'moringa drumstick', 'drumstick', 'moringa'],
    image: '/assets/produce/vegetables/drumstick.jpg',
  },
  {
    id: 'garlic',
    name: 'Desi White Garlic',
    category: 'Vegetables',
    aliases: ['mandsaur desi white garlic', 'desi white garlic', 'white garlic', 'garlic', 'lahsun'],
    image: '/assets/produce/vegetables/garlic.jpg',
  },
  {
    id: 'ginger',
    name: 'Fresh Rhizome Ginger',
    category: 'Vegetables',
    aliases: ['wayanad fresh rhizome ginger', 'fresh rhizome ginger', 'rhizome ginger', 'ginger', 'adrak'],
    image: '/assets/produce/vegetables/ginger.jpg',
  },

  // =========================================================================
  // 3. SPICES & SEASONINGS
  // =========================================================================
  {
    id: 'turmeric',
    name: 'High-Curcumin Turmeric',
    category: 'Spices & Seasonings',
    aliases: ['salem lakadong high-curcumin turmeric', 'salem lakadong turmeric', 'grade-a organic turmeric', 'organic turmeric', 'turmeric', 'haldi'],
    image: '/assets/produce/spices/turmeric.jpg',
  },
  {
    id: 'cloves',
    name: 'Aromatic Whole Cloves',
    category: 'Spices & Seasonings',
    aliases: ['kanyakumari whole aromatic clove', 'whole aromatic clove', 'aromatic clove', 'cloves', 'clove', 'laung'],
    image: '/assets/produce/spices/cloves.jpg',
  },
  {
    id: 'black-pepper',
    name: 'Tellicherry Black Pepper',
    category: 'Spices & Seasonings',
    aliases: ['malabar tellicherry bold black peppercorn', 'tellicherry bold black peppercorn', 'bold black peppercorn', 'black pepper', 'peppercorn', 'kalimirch'],
    image: '/assets/produce/spices/black-pepper.jpg',
  },
  {
    id: 'cardamom',
    name: 'Extra Bold Green Cardamom',
    category: 'Spices & Seasonings',
    aliases: ['idukki extra bold green cardamom', 'extra bold green cardamom', 'bold green cardamom', 'green cardamom', 'cardamom', 'elaichi'],
    image: '/assets/produce/spices/cardamom.jpg',
  },
  {
    id: 'cinnamon',
    name: 'Ceylon True Sweet Cinnamon',
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
    id: 'dried-red-chilli',
    name: 'Byadgi Dried Red Chillies',
    category: 'Spices & Seasonings',
    aliases: ['byadgi wrinkled mild red chilli', 'wrinkled mild red chilli', 'byadgi red chilli', 'dried red chilli', 'red chilli', 'lal mirch'],
    image: '/assets/produce/spices/dried-red-chilli.jpg',
  },
  {
    id: 'saffron',
    name: 'Pampore Mongra Grade-A1 Saffron',
    category: 'Spices & Seasonings',
    aliases: ['pampore mongra grade-a1 pure saffron', 'organic kashmiri saffron', 'grade-a1 pure saffron', 'pure saffron', 'kashmiri saffron', 'saffron', 'kesar'],
    image: '/assets/produce/spices/saffron.jpg',
  },

  // =========================================================================
  // 4. GRAINS & CEREALS
  // =========================================================================
  {
    id: 'basmati-rice',
    name: 'Royal Long-Grain Basmati Rice',
    category: 'Grains & Cereals',
    aliases: ['traditional royal long-grain basmati rice', 'royal long-grain basmati rice', 'long-grain basmati rice', 'basmati rice', 'basmati'],
    image: '/assets/produce/grains/basmati-rice.jpg',
  },
  {
    id: 'sona-masoori-rice',
    name: 'Sona Masoori Raw Rice',
    category: 'Grains & Cereals',
    aliases: ['sona masoori raw unpolished rice', 'sona masoori rice', 'unpolished rice', 'raw rice', 'rice', 'chawal'],
    image: '/assets/produce/grains/sona-masoori-rice.jpg',
  },
  {
    id: 'wheat',
    name: 'Sharbati Golden Wheat',
    category: 'Grains & Cereals',
    aliases: ['sehore sharbati golden wheat grain', 'sharbati golden wheat grain', 'golden wheat grain', 'sharbati wheat', 'wheat', 'gehu'],
    image: '/assets/produce/grains/wheat.jpg',
  },
  {
    id: 'ragi',
    name: 'Finger Millet (Ragi)',
    category: 'Grains & Cereals',
    aliases: ['mandya whole finger millet', 'whole finger millet', 'finger millet', 'ragi whole grain', 'ragi grain', 'ragi'],
    image: '/assets/produce/grains/ragi.jpg',
  },
  {
    id: 'bajra',
    name: 'Pearl Millet (Bajra)',
    category: 'Grains & Cereals',
    aliases: ['rajasthan desi pearl millet', 'desi pearl millet', 'pearl millet', 'bajra grain', 'bajra'],
    image: '/assets/produce/grains/bajra.jpg',
  },
  {
    id: 'jowar',
    name: 'Sorghum Grain (Jowar)',
    category: 'Grains & Cereals',
    aliases: ['solapur white sorghum grain', 'white sorghum grain', 'sorghum grain', 'jowar whole', 'jowar'],
    image: '/assets/produce/grains/jowar.jpg',
  },

  // =========================================================================
  // 5. PULSES & DALS
  // =========================================================================
  {
    id: 'rajma',
    name: 'Jammu Chitra Red Rajma',
    category: 'Pulses & Dals',
    aliases: ['jammu chitra red rajma', 'chitra red rajma', 'red rajma', 'kidney bean', 'kidney beans', 'rajma'],
    image: '/assets/produce/pulses/rajma.jpg',
  },
  {
    id: 'chickpeas',
    name: 'White Kabuli Chickpeas',
    category: 'Pulses & Dals',
    aliases: ['giant white kabuli chickpea', 'white kabuli chickpea', 'kabuli chickpea', 'kabuli chana', 'chickpea', 'chickpeas', 'chana'],
    image: '/assets/produce/pulses/chickpeas.jpg',
  },
  {
    id: 'toor-dal',
    name: 'Desi Unpolished Toor Dal',
    category: 'Pulses & Dals',
    aliases: ['gulbarga desi unpolished toor dal', 'desi unpolished toor dal', 'unpolished toor dal', 'toor dal', 'arhar dal', 'arhar', 'toordal'],
    image: '/assets/produce/pulses/toor-dal.jpg',
  },
  {
    id: 'moong-dal',
    name: 'Split Yellow Moong Dal',
    category: 'Pulses & Dals',
    aliases: ['split yellow moong dal', 'yellow moong dal', 'unpolished moong dal', 'moong dal', 'moongdal', 'moong'],
    image: '/assets/produce/pulses/moong-dal.jpg',
  },
  {
    id: 'urad-dal',
    name: 'Whole Black Urad Dal',
    category: 'Pulses & Dals',
    aliases: ['guntur whole black urad dal', 'whole black urad dal', 'black urad dal', 'gooty urad', 'urad dal', 'uraddal', 'urad'],
    image: '/assets/produce/pulses/urad-dal.jpg',
  },

  // =========================================================================
  // 6. HERBS & LEAFY GREENS
  // =========================================================================
  {
    id: 'spinach',
    name: 'Baby Spinach Leaves (Palak)',
    category: 'Herbs & Leafy Greens',
    aliases: ['hydroponic baby spinach leaf', 'baby spinach leaf', 'baby spinach', 'spinach leaf', 'spinach', 'palak'],
    image: '/assets/produce/herbs/spinach.jpg',
  },
  {
    id: 'coriander-leaves',
    name: 'Fresh Coriander (Dhaniya)',
    category: 'Herbs & Leafy Greens',
    aliases: ['fragrant country coriander leaf', 'country coriander leaf', 'coriander leaf', 'coriander', 'dhaniya', 'kothmir'],
    image: '/assets/produce/herbs/coriander-leaves.jpg',
  },
  {
    id: 'mint',
    name: 'Fresh Peppermint (Pudina)',
    category: 'Herbs & Leafy Greens',
    aliases: ['fresh garden peppermint', 'garden peppermint', 'spearmint leaf', 'peppermint', 'spearmint', 'mint', 'pudina'],
    image: '/assets/produce/herbs/mint.jpg',
  },
  {
    id: 'curry-leaves',
    name: 'Fragrant Curry Leaves',
    category: 'Herbs & Leafy Greens',
    aliases: ['organic fragrant curry leaf', 'fragrant curry leaf', 'curry leaf', 'curry leaves', 'kadi patta', 'kadipatta'],
    image: '/assets/produce/herbs/curry-leaves.jpg',
  },
  {
    id: 'fenugreek-leaves',
    name: 'Tender Fenugreek Greens (Methi)',
    category: 'Herbs & Leafy Greens',
    aliases: ['fresh tender fenugreek green', 'tender fenugreek green', 'fenugreek green', 'fenugreek leaf', 'methi leaf', 'methi'],
    image: '/assets/produce/herbs/fenugreek-leaves.jpg',
  },
  {
    id: 'lettuce',
    name: 'Hydroponic Butterhead Lettuce',
    category: 'Herbs & Leafy Greens',
    aliases: ['crisp hydroponic butterhead salad lettuce', 'butterhead salad lettuce', 'salad lettuce', 'butterhead lettuce', 'lettuce'],
    image: '/assets/produce/herbs/lettuce.jpg',
  },

  // =========================================================================
  // 7. ORGANIC & NATURAL
  // =========================================================================
  {
    id: 'coconut-oil',
    name: 'Extra Virgin Cold-Pressed Coconut Oil (Marachekku)',
    category: 'Organic & Natural',
    aliases: ['extra virgin cold-pressed coconut oil', 'cold-pressed coconut oil', 'virgin coconut oil', 'marachekku coconut oil', 'coconut oil'],
    image: '/assets/produce/organic-natural/coconut-oil.jpg',
  },
  {
    id: 'jaggery',
    name: 'Kolhapur Artisanal Sugarcane Jaggery (Organic Gur)',
    category: 'Organic & Natural',
    aliases: ['kolhapur artisanal sugarcane jaggery', 'organic sugarcane jaggery block', 'sugarcane jaggery block', 'artisanal jaggery', 'organic gur', 'jaggery', 'gur'],
    image: '/assets/produce/organic-natural/jaggery.jpg',
  },
  {
    id: 'honey',
    name: 'Raw Mangrove Multi-Floral Honey',
    category: 'Organic & Natural',
    aliases: ['sundarbans wild mangrove multi-floral raw honey', 'wild mangrove raw honey', 'multi-floral raw honey', 'raw honey', 'honey', 'shahad'],
    image: '/assets/produce/organic-natural/honey.jpg',
  },
  {
    id: 'groundnut-oil',
    name: 'Cold-Pressed Groundnut Oil',
    category: 'Organic & Natural',
    aliases: ['cold-pressed groundnut oil', 'wood-pressed kacchi ghani', 'groundnut oil', 'peanut oil', 'kacchi ghani'],
    image: '/assets/produce/organic-natural/groundnut-oil.jpg',
  },
  {
    id: 'walnut',
    name: 'Kashmiri Snow-White Walnuts',
    category: 'Organic & Natural',
    aliases: ['kashmiri snow-white walnut kernel', 'snow-white walnut kernel', 'walnut kernel', 'walnut', 'akhrot giri', 'akhrot', 'dry fruits'],
    image: '/assets/produce/organic-natural/walnut.jpg',
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
 * Zero guessing, strict longest-alias matching.
 */
export function getCanonicalProduct(
  nameOrProduce?: string | { name?: string; category?: string } | null
): CanonicalProduct | null {
  if (!nameOrProduce) return null;

  const rawName = typeof nameOrProduce === 'string' ? nameOrProduce : nameOrProduce.name || '';
  const normalized = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (!normalized) return null;

  for (const entry of ALIAS_INDEX) {
    if (normalized.includes(entry.aliasNormalized)) {
      return entry.product;
    }
  }

  return null;
}
