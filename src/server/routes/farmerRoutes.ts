import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../../db/index';

const router = Router();

// GET /api/farmers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sql = `
      SELECT 
        fp.id,
        fp.farmer_slug as "farmerSlug",
        fp.farm_name as "farmName",
        fp.location,
        fp.latitude,
        fp.longitude,
        fp.experience,
        fp.specialty,
        fp.acreage,
        fp.highlight_badge as "highlightBadge",
        fp.description,
        fp.verification_status as "verificationStatus",
        u.name as "growerName",
        u.email,
        u.phone,
        u.farmer_id as "farmerId",
        COALESCE(COUNT(DISTINCT pl.id), 0) as "activeListingsCount",
        COALESCE(AVG(r.rating), 4.9) as "averageRating",
        COALESCE(COUNT(DISTINCT r.id), 0) as "reviewsCount"
      FROM farmer_profiles fp
      JOIN users u ON fp.user_id = u.id
      LEFT JOIN produce_listings pl ON (pl.farmer_email = u.email AND pl.status = 'Active')
      LEFT JOIN reviews r ON (r.farmer_id = fp.farmer_slug OR LOWER(r.farmer_name) = LOWER(u.name))
      GROUP BY fp.id, fp.farmer_slug, fp.farm_name, fp.location, fp.latitude, fp.longitude,
               fp.experience, fp.specialty, fp.acreage, fp.highlight_badge, fp.description,
               fp.verification_status, u.name, u.email, u.phone, u.farmer_id
      ORDER BY fp.created_at ASC;
    `;

    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/farmers/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const profileSql = `
      SELECT 
        fp.id,
        fp.farmer_slug as "farmerSlug",
        fp.farm_name as "farmName",
        fp.location,
        fp.latitude,
        fp.longitude,
        fp.experience,
        fp.specialty,
        fp.acreage,
        fp.highlight_badge as "highlightBadge",
        fp.description,
        fp.verification_status as "verificationStatus",
        u.name as "growerName",
        u.email,
        u.phone,
        u.farmer_id as "farmerId"
      FROM farmer_profiles fp
      JOIN users u ON fp.user_id = u.id
      WHERE fp.id = $1 OR fp.farmer_slug = $1 OR u.id = $1;
    `;

    const profileResult = await query(profileSql, [id]);
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: `Farmer ${id} not found` });
    }

    const farmer = profileResult.rows[0];

    // Fetch active listings
    const listingsSql = `
      SELECT * FROM produce_listings
      WHERE (farmer_email = $1 OR LOWER(farmer_name) = LOWER($2)) AND status = 'Active'
      ORDER BY created_at DESC;
    `;
    const listingsResult = await query(listingsSql, [farmer.email, farmer.growerName]);

    // Fetch reviews
    const reviewsSql = `
      SELECT * FROM reviews
      WHERE farmer_id = $1 OR LOWER(farmer_name) = LOWER($2)
      ORDER BY created_at DESC;
    `;
    const reviewsResult = await query(reviewsSql, [farmer.farmerSlug, farmer.growerName]);

    res.json({
      profile: farmer,
      listings: listingsResult.rows,
      reviews: reviewsResult.rows,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
