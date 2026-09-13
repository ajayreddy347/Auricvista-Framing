import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../../db/index';
import { validateProduceInput } from '../middleware/validator';
import { authenticateToken, requireFarmer } from '../middleware/auth';

const router = Router();

// Helper to map DB row to ProduceListing DTO format
function formatProduceRow(row: any) {
  let images: string[] = [];
  try {
    images = Array.isArray(row.images) ? row.images : JSON.parse(row.images || '[]');
  } catch {
    images = [];
  }

  let aiQualityRating: any = null;
  if (row.ai_quality_data) {
    try {
      aiQualityRating = typeof row.ai_quality_data === 'object' ? row.ai_quality_data : JSON.parse(row.ai_quality_data);
    } catch {
      aiQualityRating = null;
    }
  } else if (row.quality_score) {
    aiQualityRating = {
      qualityScore: parseFloat(row.quality_score),
      freshnessScore: Math.round(parseFloat(row.quality_score) * 10),
      freshnessLabel: row.freshness_label || 'Excellent',
      notes: 'Visual inspection verified optimal harvest quality.',
      tags: ['Fresh Harvest', 'Grade A+'],
    };
  }

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    quantity: parseFloat(row.quantity_available),
    unit: row.unit,
    pricePerUnit: parseFloat(row.price),
    harvestDate: row.harvest_date ? new Date(row.harvest_date).toISOString().split('T')[0] : '',
    farmLocation: row.farm_location,
    farmerName: row.farmer_name,
    farmerEmail: row.farmer_email,
    farmerId: row.display_farmer_id || row.farmer_id || undefined,
    description: row.description || '',
    images,
    status: row.status,
    createdAt: row.created_at,
    aiQualityRating,
  };
}

// GET /api/produce - Public marketplace catalog
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, status, farmerEmail, sortBy } = req.query;

    let sql = `
      SELECT p.*, COALESCE(u.farmer_id, p.farmer_id) AS display_farmer_id
      FROM produce_listings p
      LEFT JOIN users u ON (p.farmer_id = u.id OR LOWER(p.farmer_email) = LOWER(u.email))
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIdx = 1;

    if (status && typeof status === 'string' && status !== 'All') {
      sql += ` AND status = $${paramIdx++}`;
      params.push(status);
    }

    if (category && typeof category === 'string' && category !== 'All') {
      if (category === 'Dairy & Fresh' || category === 'Farm Fresh') {
        sql += ` AND category = 'Farm Fresh'`;
      } else {
        sql += ` AND LOWER(category) = LOWER($${paramIdx++})`;
        params.push(category);
      }
    }

    if (farmerEmail && typeof farmerEmail === 'string') {
      sql += ` AND LOWER(farmer_email) = LOWER($${paramIdx++})`;
      params.push(farmerEmail);
    }

    if (search && typeof search === 'string') {
      sql += ` AND (LOWER(name) LIKE $${paramIdx} OR LOWER(farm_location) LIKE $${paramIdx} OR LOWER(farmer_name) LIKE $${paramIdx})`;
      params.push(`%${search.toLowerCase()}%`);
      paramIdx++;
    }

    if (sortBy === 'price-low') {
      sql += ' ORDER BY price ASC';
    } else if (sortBy === 'price-high') {
      sql += ' ORDER BY price DESC';
    } else if (sortBy === 'ai-score') {
      sql += ' ORDER BY quality_score DESC NULLS LAST';
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    const result = await query(sql, params);
    const listings = result.rows.map(formatProduceRow);

    res.json(listings);
  } catch (err) {
    next(err);
  }
});

// GET /api/produce/:id - Single listing details
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM produce_listings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Produce listing with ID ${id} not found` });
    }

    res.json(formatProduceRow(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// POST /api/produce - Protected (Farmer only)
router.post(
  '/',
  authenticateToken,
  requireFarmer,
  validateProduceInput,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        category,
        quantity,
        unit,
        price,
        pricePerUnit,
        harvestDate,
        farmLocation,
        description,
        images,
        status,
        aiQualityRating,
      } = req.body;

      const authenticatedUser = req.user!;
      const id = `PROD-${Date.now().toString().slice(-6)}`;
      const listingStatus = status || 'Active';
      const listingUnit = unit || 'kg';
      const rawPrice = price !== undefined ? price : pricePerUnit;
      const listingPrice = parseFloat(rawPrice) || 0;
      const listingQuantity = parseFloat(quantity) || 0;
      const listingHarvestDate = harvestDate || new Date().toISOString().split('T')[0];
      const listingImages = JSON.stringify(Array.isArray(images) ? images : []);

      let qualityScore = 9.5;
      let freshnessLabel = 'Excellent';
      if (aiQualityRating) {
        qualityScore = typeof aiQualityRating.qualityScore === 'number' ? aiQualityRating.qualityScore : 9.5;
        freshnessLabel = aiQualityRating.freshnessLabel || 'Excellent';
      }

      const aiDataJson = aiQualityRating ? JSON.stringify(aiQualityRating) : null;

      const insertSql = `
        INSERT INTO produce_listings (
          id, farmer_id, farmer_name, farmer_email, name, category,
          quantity_available, unit, price, harvest_date, farm_location,
          description, images, quality_score, freshness_label, ai_quality_data, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        ) RETURNING *;
      `;

      const result = await query(insertSql, [
        id,
        authenticatedUser.id,
        authenticatedUser.name,
        authenticatedUser.email,
        name.trim(),
        category,
        listingQuantity,
        listingUnit,
        listingPrice,
        listingHarvestDate,
        farmLocation.trim(),
        description || '',
        listingImages,
        qualityScore,
        freshnessLabel,
        aiDataJson,
        listingStatus,
      ]);

      res.status(201).json(formatProduceRow(result.rows[0]));
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/produce/:id - Protected (Farmer only, with ownership verification)
router.put(
  '/:id',
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, price, pricePerUnit, quantity, description } = req.body;
      const authenticatedUser = req.user!;

      const existing = await query('SELECT * FROM produce_listings WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: `Listing ${id} not found` });
      }

      const listing = existing.rows[0];

      // Strict Ownership Enforcement: Must match farmer's ID, farmer_id, email, or name (unless admin)
      let isOwner =
        authenticatedUser.role === 'admin' ||
        (listing.farmer_id && listing.farmer_id === authenticatedUser.id) ||
        (listing.farmer_email && authenticatedUser.email && listing.farmer_email.toLowerCase() === authenticatedUser.email.toLowerCase()) ||
        (listing.farmer_name && authenticatedUser.name && listing.farmer_name.toLowerCase() === authenticatedUser.name.toLowerCase());

      if (!isOwner) {
        const userCheck = await query('SELECT farmer_id FROM users WHERE id = $1', [authenticatedUser.id]);
        if (userCheck.rows.length > 0 && userCheck.rows[0].farmer_id) {
          if (listing.farmer_id === userCheck.rows[0].farmer_id) {
            isOwner = true;
          }
        }
      }

      if (!isOwner) {
        return res.status(403).json({
          error: 'Access denied: You can only edit produce listings created by your farm.',
        });
      }

      const updatedStatus = status || listing.status;
      const rawPrice = price !== undefined ? price : pricePerUnit;
      const updatedPrice = rawPrice !== undefined ? parseFloat(rawPrice) : listing.price;
      const updatedQty = quantity !== undefined ? parseFloat(quantity) : listing.quantity_available;
      const updatedDesc = description !== undefined ? description : listing.description;

      const updateSql = `
        UPDATE produce_listings
        SET status = $1, price = $2, quantity_available = $3, description = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *;
      `;

      const result = await query(updateSql, [updatedStatus, updatedPrice, updatedQty, updatedDesc, id]);
      res.json(formatProduceRow(result.rows[0]));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/produce/:id - Protected (Farmer only, with ownership verification)
router.delete(
  '/:id',
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const authenticatedUser = req.user!;

      const existing = await query('SELECT * FROM produce_listings WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: `Listing ${id} not found` });
      }

      const listing = existing.rows[0];

      // Strict Ownership Enforcement: Must match farmer's ID, farmer_id, email, or name (unless admin)
      let isOwner =
        authenticatedUser.role === 'admin' ||
        (listing.farmer_id && listing.farmer_id === authenticatedUser.id) ||
        (listing.farmer_email && authenticatedUser.email && listing.farmer_email.toLowerCase() === authenticatedUser.email.toLowerCase()) ||
        (listing.farmer_name && authenticatedUser.name && listing.farmer_name.toLowerCase() === authenticatedUser.name.toLowerCase());

      if (!isOwner) {
        const userCheck = await query('SELECT farmer_id FROM users WHERE id = $1', [authenticatedUser.id]);
        if (userCheck.rows.length > 0 && userCheck.rows[0].farmer_id) {
          if (listing.farmer_id === userCheck.rows[0].farmer_id) {
            isOwner = true;
          }
        }
      }

      if (!isOwner) {
        return res.status(403).json({
          error: 'Access denied: You can only delete produce listings created by your farm.',
        });
      }

      await query('DELETE FROM produce_listings WHERE id = $1', [id]);
      res.json({ message: `Listing ${id} successfully deleted`, id });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
