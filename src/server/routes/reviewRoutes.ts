import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../../db/index';
import { validateReviewInput } from '../middleware/validator';
import { authenticateToken, requireCustomer } from '../middleware/auth';

const router = Router();

function formatReviewRow(row: any) {
  let photos: string[] = [];
  try {
    photos = Array.isArray(row.photos) ? row.photos : JSON.parse(row.photos || '[]');
  } catch {
    photos = [];
  }

  return {
    id: row.id,
    farmerId: row.farmer_id,
    farmerName: row.farmer_name,
    produceId: row.produce_id,
    produceName: row.produce_name,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    rating: parseFloat(row.rating),
    comment: row.comment,
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    verified: Boolean(row.verified),
    photos,
    helpfulCount: parseInt(row.helpful_count, 10) || 0,
  };
}

// GET /api/reviews - Public reviews retrieval
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmerId, produceId } = req.query;

    let sql = 'SELECT * FROM reviews WHERE 1=1';
    const params: any[] = [];
    let paramIdx = 1;

    if (farmerId && typeof farmerId === 'string') {
      sql += ` AND (LOWER(farmer_id) = LOWER($${paramIdx}) OR LOWER(farmer_name) LIKE $${paramIdx + 1})`;
      params.push(farmerId.trim(), `%${farmerId.trim().toLowerCase()}%`);
      paramIdx += 2;
    }

    if (produceId && typeof produceId === 'string') {
      sql += ` AND produce_id = $${paramIdx++}`;
      params.push(produceId.trim());
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows.map(formatReviewRow));
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews - Protected (Customer only with server validation)
router.post(
  '/',
  authenticateToken,
  requireCustomer,
  validateReviewInput,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { farmerId, farmerName, produceId, produceName, rating, comment, verified, photos } = req.body;

      if (!farmerId || typeof farmerId !== 'string') {
        return res.status(400).json({ error: 'Valid farmer ID or slug is required' });
      }

      // Check farmer reference in database
      const farmerCheck = await query(
        `SELECT fp.farmer_slug, fp.farm_name, u.name as grower_name
         FROM farmer_profiles fp
         JOIN users u ON fp.user_id = u.id
         WHERE fp.farmer_slug = $1 OR fp.id = $1 OR u.id = $1 OR LOWER(u.name) = LOWER($1) OR LOWER(u.email) = LOWER($1)
         LIMIT 1`,
        [farmerId.trim()]
      );

      let verifiedFarmerName = farmerName || 'Verified Regional Grower';
      let verifiedFarmerId = farmerId.trim();

      if (farmerCheck.rows.length > 0) {
        verifiedFarmerName = farmerCheck.rows[0].grower_name || farmerName;
        verifiedFarmerId = farmerCheck.rows[0].farmer_slug || farmerId.trim();
      }

      // If produceId supplied, verify it exists in produce_listings
      let verifiedProduceName = produceName || null;
      if (produceId) {
        const produceCheck = await query('SELECT name FROM produce_listings WHERE id = $1', [produceId]);
        if (produceCheck.rows.length > 0) {
          verifiedProduceName = produceCheck.rows[0].name;
        }
      }

      const id = `REV-${Date.now().toString().slice(-6)}`;
      const ratingNum = Math.min(5, Math.max(1, parseFloat(rating) || 5));
      const photosJson = JSON.stringify(Array.isArray(photos) ? photos : []);

      const insertSql = `
        INSERT INTO reviews (
          id, farmer_id, farmer_name, produce_id, produce_name,
          customer_name, customer_email, rating, comment, verified,
          photos, helpful_count
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0
        ) RETURNING *;
      `;

      const result = await query(insertSql, [
        id,
        verifiedFarmerId,
        verifiedFarmerName,
        produceId || null,
        verifiedProduceName,
        user.name,
        user.email.toLowerCase(),
        ratingNum,
        comment.trim(),
        verified !== undefined ? Boolean(verified) : true,
        photosJson,
      ]);

      res.status(201).json(formatReviewRow(result.rows[0]));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
