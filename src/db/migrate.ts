import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { query } from './index';

export async function runMigrations(): Promise<void> {
  console.log('[Database Migration] Initializing PostgreSQL schema for AuricVista Direct Farm...');

  try {
    const cwd = process.cwd();
    const candidates = [
      path.resolve(cwd, 'src/db/schema.sql'),
      path.resolve(cwd, 'dist/schema.sql'),
      path.resolve(cwd, 'schema.sql'),
    ];

    let schemaSql = '';
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        schemaSql = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (schemaSql) {
      await query(schemaSql);
      console.log('[Database Migration] Schema applied successfully.');
    } else {
      console.warn('[Database Migration] schema.sql not found; verifying existing tables.');
    }

    // Seed initial data if produce_listings table is empty
    const produceCheck = await query('SELECT COUNT(*) FROM produce_listings;');
    const count = parseInt(produceCheck.rows[0].count, 10);

    if (count === 0) {
      console.log('[Database Migration] Seeding initial verified farmers and harvest catalog...');
      await seedInitialData();
    } else {
      console.log(`[Database Migration] Database contains ${count} active produce listings. Skipping seed.`);
    }

    // Ensure demo farmers have valid password hashes
    const demoPasswordHash = await bcrypt.hash('FarmPass@2026', 10);
    await query(
      `UPDATE users SET password_hash = $1 WHERE password_hash IS NULL;`,
      [demoPasswordHash]
    );
  } catch (err: any) {
    console.error('[Database Migration Error] Migration failed:', err);
    throw err;
  }
}

async function seedInitialData(): Promise<void> {
  const defaultHash = await bcrypt.hash('FarmPass@2026', 10);

  // 1. Seed Verified Farmers (Users & Farmer Profiles)
  const farmers = [
    {
      userId: 'usr-ravi-kumar',
      name: 'Ravi Kumar',
      email: 'ravi.kumar@auricvista.farm',
      role: 'farmer',
      phone: '+91 98450 12890',
      location: 'Chikkaballapur Valley, Karnataka',
      farmName: 'Kumar Organic Heritage Farm #702',
      farmerSlug: 'ravi-kumar',
      experience: '18 years',
      specialty: 'Organic Vine Tomatoes & Bell Peppers',
      acreage: '14 Acres Certified Natural',
      highlightBadge: 'Master Grower',
      description: 'Pioneer of chemical-free heirloom vegetable cultivation in the fertile red soil of Chikkaballapur.',
    },
    {
      userId: 'usr-lakshmi-devi',
      name: 'Lakshmi Devi',
      email: 'lakshmi.devi@auricvista.farm',
      role: 'farmer',
      phone: '+91 94480 34120',
      location: 'Kolar Organic Belt, Karnataka',
      farmName: 'Devi Hydroponic Greenhouses',
      farmerSlug: 'lakshmi-devi',
      experience: '12 years',
      specialty: 'Hydroponic Greens & Exotic Melons',
      acreage: '8 Acres Precision Soil',
      highlightBadge: 'Zero Pesticide Pioneer',
      description: 'Specializes in nutrient-film hydroponics and zero-nitrate crisp salad greens harvested at dawn.',
    },
    {
      userId: 'usr-suresh-naidu',
      name: 'Suresh Naidu',
      email: 'suresh.naidu@auricvista.farm',
      role: 'farmer',
      phone: '+91 98860 78234',
      location: 'Hosur Agro Ridge, Tamil Nadu / Karnataka Border',
      farmName: 'Naidu Heritage Farm',
      farmerSlug: 'suresh-naidu',
      experience: '22 years',
      specialty: 'Heritage Millets, Pulses & Desi Dairy',
      acreage: '26 Acres Ancestral Farm',
      highlightBadge: 'Heritage Cultivator',
      description: 'Preserves native drought-resistant millet seeds and unpolished heirloom lentils.',
    },
  ];

  for (const f of farmers) {
    await query(
      `INSERT INTO users (id, name, email, password_hash, role, phone, location, farm_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash WHERE users.password_hash IS NULL;`,
      [f.userId, f.name, f.email, defaultHash, f.role, f.phone, f.location, f.farmName]
    );

    await query(
      `INSERT INTO farmer_profiles (id, user_id, farmer_slug, farm_name, location, experience, specialty, acreage, highlight_badge, description, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'verified')
       ON CONFLICT (farmer_slug) DO NOTHING;`,
      [
        `prof-${f.farmerSlug}`,
        f.userId,
        f.farmerSlug,
        f.farmName,
        f.location,
        f.experience,
        f.specialty,
        f.acreage,
        f.highlightBadge,
        f.description,
      ]
    );
  }

  // 2. Seed Initial Produce Listings
  const initialListings = [
    {
      id: 'PROD-101',
      farmerId: 'usr-ravi-kumar',
      farmerName: 'Ravi Kumar',
      farmerEmail: 'ravi.kumar@auricvista.farm',
      farmLocation: 'Kumar Organic Heritage Farm, Chikkaballapur Valley',
      name: 'Heirloom Vine Tomatoes',
      category: 'Vegetables',
      quantity: 80,
      unit: 'kg',
      price: 35,
      harvestDate: new Date().toISOString().split('T')[0],
      description: 'Vine-ripened, sun-kissed naturally pollinated tomatoes harvested at dawn with exceptional sweetness and high lycopene content.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800']),
      qualityScore: 9.8,
      freshnessLabel: 'Excellent',
      aiQualityData: JSON.stringify({
        qualityScore: 9.8,
        freshnessScore: 98,
        freshnessLabel: 'Excellent',
        grade: 'Grade A+ Premium',
        badge: 'Peak Crispness',
        notes: 'High turgor pressure detected; uniform vibrant pigmentation with zero blemish markers.',
        analysisNote: 'High turgor pressure detected; uniform vibrant pigmentation with zero blemish markers.',
        tags: ['Peak Crispness', 'Uniform Color', 'Grade A+'],
      }),
      status: 'Active',
    },
    {
      id: 'PROD-102',
      farmerId: 'usr-ravi-kumar',
      farmerName: 'Ravi Kumar',
      farmerEmail: 'ravi.kumar@auricvista.farm',
      farmLocation: 'Kumar Organic Heritage Farm, Chikkaballapur Valley',
      name: 'Hydroponic Baby Spinach',
      category: 'Vegetables',
      quantity: 45,
      unit: 'bunch',
      price: 40,
      harvestDate: new Date().toISOString().split('T')[0],
      description: 'Pesticide-free hydroponically grown crisp baby spinach leaves harvested fresh with roots intact in mineral-rich cold water.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800']),
      qualityScore: 9.9,
      freshnessLabel: 'Excellent',
      aiQualityData: JSON.stringify({
        qualityScore: 9.9,
        freshnessScore: 99,
        freshnessLabel: 'Excellent',
        grade: 'Grade A+ Organic',
        badge: 'Zero-Nitrate Residue',
        notes: 'Pristine chlorophyll density and intact crisp leaf margins.',
        analysisNote: 'Pristine chlorophyll density and intact crisp leaf margins.',
        tags: ['Zero Chemical', 'Crisp Leaves', 'Hydroponic'],
      }),
      status: 'Active',
    },
    {
      id: 'PROD-103',
      farmerId: 'usr-ravi-kumar',
      farmerName: 'Ravi Kumar',
      farmerEmail: 'ravi.kumar@auricvista.farm',
      farmLocation: 'Kumar Organic Heritage Farm, Chikkaballapur Valley',
      name: 'Heritage Rainbow Carrots',
      category: 'Vegetables',
      quantity: 120,
      unit: 'kg',
      price: 50,
      harvestDate: new Date().toISOString().split('T')[0],
      description: 'Deep purple, yellow and deep orange sweet heirloom carrots rich in natural antioxidants and soil minerals.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800']),
      qualityScore: 9.6,
      freshnessLabel: 'Excellent',
      aiQualityData: JSON.stringify({
        qualityScore: 9.6,
        freshnessScore: 96,
        freshnessLabel: 'Excellent',
        grade: 'Grade A Export',
        badge: 'Mineral Rich',
        notes: 'Excellent root firmness and intact natural skin bloom.',
        analysisNote: 'Excellent root firmness and intact natural skin bloom.',
        tags: ['Heritage Heirloom', 'Firm Root', 'High Lycopene'],
      }),
      status: 'Active',
    },
  ];

  for (const item of initialListings) {
    await query(
      `INSERT INTO produce_listings (id, farmer_id, farmer_name, farmer_email, farm_location, name, category, quantity_available, unit, price, harvest_date, description, images, quality_score, freshness_label, ai_quality_data, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       ON CONFLICT (id) DO NOTHING;`,
      [
        item.id,
        item.farmerId,
        item.farmerName,
        item.farmerEmail,
        item.farmLocation,
        item.name,
        item.category,
        item.quantity,
        item.unit,
        item.price,
        item.harvestDate,
        item.description,
        item.images,
        item.qualityScore,
        item.freshnessLabel,
        item.aiQualityData,
        item.status,
      ]
    );
  }

  // 3. Seed Initial Reviews
  const reviews = [
    {
      id: 'rev-rk-1',
      farmerId: 'ravi-kumar',
      farmerName: 'Ravi Kumar',
      produceId: 'PROD-101',
      produceName: 'Heirloom Vine Tomatoes',
      customerName: 'Ananya Sharma',
      rating: 5.0,
      comment: 'The heirloom vine tomatoes arrived within 14 hours of dawn harvest. The aroma took me back to my grandparents’ farm in Karnataka. Super juicy with vibrant deep crimson flesh!',
      verified: true,
      helpfulCount: 24,
    },
    {
      id: 'rev-rk-2',
      farmerId: 'ravi-kumar',
      farmerName: 'Ravi Kumar',
      produceId: 'PROD-102',
      produceName: 'Hydroponic Baby Spinach',
      customerName: 'Vikramaditya Sengupta',
      rating: 5.0,
      comment: 'The hydroponic baby spinach had crisp, unbruised leaves with zero pesticide residue. You can taste the purity right in raw salads.',
      verified: true,
      helpfulCount: 18,
    },
    {
      id: 'rev-ld-1',
      farmerId: 'lakshmi-devi',
      farmerName: 'Lakshmi Devi',
      customerName: 'Priya Nambiar',
      rating: 5.0,
      comment: 'Lakshmi Devi’s hydroponic salad greens are the best in Bengaluru. Crisp, immaculate, and stay fresh in the fridge for over a week.',
      verified: true,
      helpfulCount: 31,
    },
  ];

  for (const r of reviews) {
    await query(
      `INSERT INTO reviews (id, farmer_id, farmer_name, produce_id, produce_name, customer_name, rating, comment, verified, helpful_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING;`,
      [r.id, r.farmerId, r.farmerName, r.produceId || null, r.produceName || null, r.customerName, r.rating, r.comment, r.verified, r.helpfulCount]
    );
  }

  console.log('[Database Migration] Initial seeding completed successfully.');
}
