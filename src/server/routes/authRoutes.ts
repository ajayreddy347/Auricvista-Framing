import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../../db/index';
import { generateToken, authenticateToken } from '../middleware/auth';

const router = Router();

// Helper to format safe user profile object
function formatSafeUser(userRow: any, farmerProfileRow?: any) {
  return {
    id: userRow.id,
    farmerId: userRow.farmer_id || undefined,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    phone: userRow.phone || undefined,
    location: userRow.location || farmerProfileRow?.location || undefined,
    farmName: userRow.farm_name || farmerProfileRow?.farm_name || undefined,
    mainCrops: userRow.main_crops || undefined,
    address: userRow.address || undefined,
    createdAt: userRow.created_at,
    farmerProfile: farmerProfileRow
      ? {
          id: farmerProfileRow.id,
          farmerSlug: farmerProfileRow.farmer_slug,
          farmName: farmerProfileRow.farm_name,
          location: farmerProfileRow.location,
          experience: farmerProfileRow.experience,
          specialty: farmerProfileRow.specialty,
          acreage: farmerProfileRow.acreage,
          highlightBadge: farmerProfileRow.highlight_badge,
          verificationStatus: farmerProfileRow.verification_status,
        }
      : undefined,
  };
}

// Helper to generate a unique Farmer ID
async function generateUniqueFarmerId(): Promise<string> {
  let unique = false;
  let candidate = '';
  while (!unique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    candidate = `AV-FARM-${randomNum}`;
    const check = await query('SELECT id FROM users WHERE UPPER(farmer_id) = $1', [candidate.toUpperCase()]);
    if (check.rows.length === 0) {
      unique = true;
    }
  }
  return candidate;
}

// =========================================================================
// 1. POST /api/auth/register (Universal / Customer / Farmer Email Registration)
// =========================================================================
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, phone, location, farmName, mainCrops, address, pin } = req.body;
    const errors: string[] = [];

    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('Full name is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.push('Valid email address is required');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    const validRoles = ['farmer', 'customer'];
    if (!role || !validRoles.includes(role)) {
      errors.push('Role must be either "farmer" or "customer"');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email address already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const pinHash = pin ? await bcrypt.hash(String(pin), saltRounds) : await bcrypt.hash('2026', saltRounds);

    const userId = `usr-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const userLocation = location ? location.trim() : (role === 'farmer' ? 'Karnataka Agro Zone' : 'Bengaluru');
    const userFarmName = role === 'farmer' ? (farmName ? farmName.trim() : `${name.trim()}'s Organic Farm`) : null;
    const userMainCrops = role === 'farmer' ? (mainCrops ? mainCrops.trim() : null) : null;
    const userAddress = role === 'customer' ? (address ? address.trim() : userLocation) : null;
    const generatedFarmerId = role === 'farmer' ? await generateUniqueFarmerId() : null;

    // Insert user record
    const insertUserSql = `
      INSERT INTO users (id, farmer_id, name, email, password_hash, pin_hash, role, phone, location, farm_name, main_crops, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const userResult = await query(insertUserSql, [
      userId,
      generatedFarmerId,
      name.trim(),
      normalizedEmail,
      passwordHash,
      pinHash,
      role,
      phone ? phone.trim() : null,
      userLocation,
      userFarmName,
      userMainCrops,
      userAddress,
    ]);

    let farmerProfileRow = null;
    if (role === 'farmer') {
      const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const slug = `${baseSlug}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
      const profileId = `prof-${slug}`;

      const insertProfileSql = `
        INSERT INTO farmer_profiles (
          id, user_id, farmer_slug, farm_name, location, experience, specialty,
          acreage, highlight_badge, description, verification_status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'verified'
        ) RETURNING *;
      `;

      const profileRes = await query(insertProfileSql, [
        profileId,
        userId,
        slug,
        userFarmName,
        userLocation,
        '5+ years',
        userMainCrops || 'Natural & Organic Cultivation',
        '5 Acres',
        'Verified Grower',
        'Dedicated to chemical-free regional produce and direct consumer fair trade.',
      ]);

      farmerProfileRow = profileRes.rows[0];
    }

    const safeUser = formatSafeUser(userResult.rows[0], farmerProfileRow);
    const token = generateToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role as any,
      name: safeUser.name,
    });

    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: safeUser,
      farmerId: generatedFarmerId,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 2. POST /api/auth/farmer-register (Dedicated Farmer Registration with ID + PIN)
// =========================================================================
router.post('/farmer-register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, location, farmName, mainCrops, pin, email } = req.body;
    const errors: string[] = [];

    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('Farmer full name is required');
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      errors.push('Registered mobile number is required');
    }

    if (!pin || String(pin).length < 4) {
      errors.push('Security PIN must be at least 4 digits');
    }

    if (!farmName || typeof farmName !== 'string' || !farmName.trim()) {
      errors.push('Farm or estate name is required');
    }

    if (!location || typeof location !== 'string' || !location.trim()) {
      errors.push('Farm/village location is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const farmerId = await generateUniqueFarmerId();
    const normalizedEmail = email && typeof email === 'string' && email.trim().includes('@')
      ? email.trim().toLowerCase()
      : `${farmerId.toLowerCase()}@farmer.auricvista.farm`;

    // Check if email already in use
    const existingEmail = await query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email address already exists' });
    }

    const saltRounds = 10;
    const pinHash = await bcrypt.hash(String(pin).trim(), saltRounds);
    const passwordHash = await bcrypt.hash(`Farm@${String(pin).trim()}2026`, saltRounds);

    const userId = `usr-farmer-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const userLocation = location.trim();
    const userFarmName = farmName.trim();
    const userMainCrops = mainCrops ? mainCrops.trim() : 'Fresh Organic Produce';

    const insertUserSql = `
      INSERT INTO users (id, farmer_id, name, email, password_hash, pin_hash, role, phone, location, farm_name, main_crops)
      VALUES ($1, $2, $3, $4, $5, $6, 'farmer', $7, $8, $9, $10)
      RETURNING *;
    `;

    const userResult = await query(insertUserSql, [
      userId,
      farmerId,
      name.trim(),
      normalizedEmail,
      passwordHash,
      pinHash,
      phone.trim(),
      userLocation,
      userFarmName,
      userMainCrops,
    ]);

    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
    const profileId = `prof-${slug}`;

    const insertProfileSql = `
      INSERT INTO farmer_profiles (
        id, user_id, farmer_slug, farm_name, location, experience, specialty,
        acreage, highlight_badge, description, verification_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'verified'
      ) RETURNING *;
    `;

    const profileRes = await query(insertProfileSql, [
      profileId,
      userId,
      slug,
      userFarmName,
      userLocation,
      '5+ years',
      userMainCrops,
      '5 Acres',
      'Verified Direct Grower',
      `Producer of natural ${userMainCrops} cultivated in ${userLocation}.`,
    ]);

    const safeUser = formatSafeUser(userResult.rows[0], profileRes.rows[0]);
    const token = generateToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role as any,
      name: safeUser.name,
    });

    res.status(201).json({
      message: 'Farmer registered successfully',
      token,
      user: safeUser,
      farmerId,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 3. POST /api/auth/login (Dual Auth: Farmer ID + PIN OR Email + Password)
// =========================================================================
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, farmerId, pin } = req.body;

    // --- METHOD A: Farmer ID + PIN Authentication ---
    if (farmerId && pin) {
      const cleanFarmerId = String(farmerId).trim().toUpperCase();
      const cleanPin = String(pin).trim();

      const userResult = await query(
        `SELECT * FROM users WHERE (UPPER(farmer_id) = $1 OR phone = $2 OR REPLACE(phone, ' ', '') = REPLACE($2, ' ', '')) AND role = 'farmer'`,
        [cleanFarmerId, String(farmerId).trim()]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid Farmer ID or PIN. Please check your credentials.' });
      }

      const user = userResult.rows[0];

      // Check PIN hash
      let pinMatches = false;
      if (user.pin_hash) {
        pinMatches = await bcrypt.compare(cleanPin, user.pin_hash);
      }

      // Fallback check against password hash in case PIN equals password
      if (!pinMatches && user.password_hash) {
        pinMatches = await bcrypt.compare(cleanPin, user.password_hash);
      }

      if (!pinMatches) {
        return res.status(401).json({ error: 'Invalid Farmer ID or PIN. Please check your credentials.' });
      }

      let farmerProfileRow = null;
      const profileRes = await query('SELECT * FROM farmer_profiles WHERE user_id = $1', [user.id]);
      if (profileRes.rows.length > 0) {
        farmerProfileRow = profileRes.rows[0];
      }

      const safeUser = formatSafeUser(user, farmerProfileRow);
      const token = generateToken({
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role as any,
        name: safeUser.name,
      });

      return res.json({
        message: 'Farmer logged in successfully',
        token,
        user: safeUser,
      });
    }

    // --- METHOD B: Email + Password Authentication ---
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter your login credentials.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userResult = await query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    if (!user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let farmerProfileRow = null;
    if (user.role === 'farmer') {
      const profileRes = await query('SELECT * FROM farmer_profiles WHERE user_id = $1', [user.id]);
      if (profileRes.rows.length > 0) {
        farmerProfileRow = profileRes.rows[0];
      }
    }

    const safeUser = formatSafeUser(user, farmerProfileRow);
    const token = generateToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role as any,
      name: safeUser.name,
    });

    res.json({
      message: 'Logged in successfully',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 4. POST /api/auth/reset-pin (Forgot PIN Verification & Reset)
// =========================================================================
router.post('/reset-pin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmerId, phone, newPin } = req.body;

    if (!farmerId || !phone || !newPin) {
      return res.status(400).json({ error: 'Farmer ID, registered mobile number, and new PIN are required.' });
    }

    if (String(newPin).length < 4) {
      return res.status(400).json({ error: 'New PIN must be at least 4 digits.' });
    }

    const cleanFarmerId = String(farmerId).trim().toUpperCase();
    const cleanPhone = String(phone).trim();

    // Verify farmer exists with matching Farmer ID and Phone Number
    const checkSql = `
      SELECT * FROM users 
      WHERE (UPPER(farmer_id) = $1 OR UPPER(email) LIKE $3)
        AND (phone = $2 OR REPLACE(phone, ' ', '') = REPLACE($2, ' ', '') OR phone LIKE $4)
        AND role = 'farmer';
    `;

    const checkRes = await query(checkSql, [
      cleanFarmerId,
      cleanPhone,
      `%${cleanFarmerId}%`,
      `%${cleanPhone.slice(-10)}%`,
    ]);

    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        error: 'No matching farmer record found with this Farmer ID and mobile number.',
      });
    }

    const user = checkRes.rows[0];
    const saltRounds = 10;
    const newPinHash = await bcrypt.hash(String(newPin).trim(), saltRounds);

    await query('UPDATE users SET pin_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
      newPinHash,
      user.id,
    ]);

    res.json({
      success: true,
      message: 'PIN reset successfully. You can now log in using your Farmer ID and new PIN.',
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 5. GET /api/auth/me
// =========================================================================
router.get('/me', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    const userResult = await query(
      'SELECT * FROM users WHERE id = $1 OR LOWER(email) = $2',
      [userId, userEmail?.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const user = userResult.rows[0];
    let farmerProfileRow = null;

    if (user.role === 'farmer') {
      const profileRes = await query('SELECT * FROM farmer_profiles WHERE user_id = $1', [user.id]);
      if (profileRes.rows.length > 0) {
        farmerProfileRow = profileRes.rows[0];
      }
    }

    res.json({
      user: formatSafeUser(user, farmerProfileRow),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
