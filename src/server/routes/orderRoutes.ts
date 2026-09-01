import { Router, Request, Response, NextFunction } from 'express';
import { query, getClient } from '../../db/index';
import { validateOrderInput } from '../middleware/validator';
import { authenticateToken, requireCustomer } from '../middleware/auth';

const router = Router();

function formatOrderRow(orderRow: any, items: any[] = []) {
  return {
    id: orderRow.id,
    createdAt: orderRow.created_at,
    items: items.map((i) => ({
      productId: i.produce_id,
      name: i.name,
      image: i.image || '',
      price: parseFloat(i.unit_price),
      quantity: parseFloat(i.quantity),
      unit: i.unit,
      farmerId: i.farmer_id,
      farmerName: i.farmer_name,
      subtotal: parseFloat(i.subtotal),
    })),
    subtotal: parseFloat(orderRow.subtotal),
    deliveryFee: parseFloat(orderRow.delivery_fee),
    total: parseFloat(orderRow.total_amount),
    deliveryMethod: orderRow.delivery_method,
    deliveryAddress: orderRow.delivery_address || '',
    preferredDeliveryDate: orderRow.preferred_delivery_date
      ? new Date(orderRow.preferred_delivery_date).toISOString().split('T')[0]
      : '',
    paymentMethod: orderRow.payment_method,
    paymentStatus: orderRow.payment_status,
    status: orderRow.order_status,
    customerName: orderRow.customer_name,
    customerEmail: orderRow.customer_email,
    customerPhone: orderRow.customer_phone || '',
    estimatedDelivery: orderRow.estimated_delivery || `Scheduled for ${orderRow.preferred_delivery_date}`,
  };
}

// GET /api/orders - Protected (Strictly scoped by authenticated user role)
router.get('/', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { status } = req.query;

    let sql = 'SELECT DISTINCT o.* FROM orders o';
    const params: any[] = [];
    let paramIdx = 1;

    if (user.role === 'customer') {
      sql += ` WHERE (o.customer_id = $${paramIdx} OR LOWER(o.customer_email) = LOWER($${paramIdx + 1}))`;
      params.push(user.id, user.email);
      paramIdx += 2;
    } else if (user.role === 'farmer') {
      sql += ` JOIN order_items oi ON oi.order_id = o.id WHERE (oi.farmer_id = $${paramIdx} OR LOWER(oi.farmer_name) = LOWER($${paramIdx + 1}))`;
      params.push(user.id, user.name);
      paramIdx += 2;
    } else {
      sql += ' WHERE 1=1';
    }

    if (status && typeof status === 'string' && status !== 'All') {
      sql += ` AND o.order_status = $${paramIdx++}`;
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC';

    const ordersResult = await query(sql, params);
    if (ordersResult.rows.length === 0) {
      return res.json([]);
    }

    const orderIds = ordersResult.rows.map((r) => r.id);
    const itemsResult = await query(
      'SELECT * FROM order_items WHERE order_id = ANY($1)',
      [orderIds]
    );

    const itemsByOrder: Record<string, any[]> = {};
    for (const item of itemsResult.rows) {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = [];
      }
      itemsByOrder[item.order_id].push(item);
    }

    const response = ordersResult.rows.map((row) =>
      formatOrderRow(row, itemsByOrder[row.id] || [])
    );

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - Protected (Ownership strictly verified)
router.get('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: `Order ${id} not found` });
    }

    const order = orderResult.rows[0];
    const itemsResult = await query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    const items = itemsResult.rows;

    const isCustomerOwner =
      user.role === 'customer' &&
      (order.customer_id === user.id ||
        (order.customer_email && order.customer_email.toLowerCase() === user.email.toLowerCase()));

    const isFarmerVendor =
      user.role === 'farmer' &&
      items.some(
        (item) =>
          (item.farmer_id && item.farmer_id === user.id) ||
          (item.farmer_name && item.farmer_name.toLowerCase() === user.name.toLowerCase())
      );

    const isAuthorized = user.role === 'admin' || isCustomerOwner || isFarmerVendor;

    if (!isAuthorized) {
      return res.status(403).json({
        error: 'Access denied: You do not have permission to view this order.',
      });
    }

    res.json(formatOrderRow(order, items));
  } catch (err) {
    next(err);
  }
});

// POST /api/orders - Protected (Transactional inventory lock & authoritative price calculation)
router.post(
  '/',
  authenticateToken,
  requireCustomer,
  validateOrderInput,
  async (req: Request, res: Response, next: NextFunction) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const user = req.user!;
      const {
        items,
        deliveryMethod,
        deliveryAddress,
        preferredDeliveryDate,
        paymentMethod,
        customerPhone,
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Order must contain at least 1 item' });
      }

      let serverSubtotal = 0;
      const verifiedItems: Array<{
        produceId: string;
        farmerId: string | null;
        farmerName: string;
        name: string;
        image: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        subtotal: number;
      }> = [];

      // 1. Process each item with SELECT ... FOR UPDATE to lock inventory row
      for (const item of items) {
        const produceId = item.productId || item.id;
        const requestedQty = parseFloat(item.quantity);

        if (!produceId) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'Item missing valid product ID' });
        }

        if (isNaN(requestedQty) || requestedQty <= 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: `Invalid quantity for item ${item.name || produceId}` });
        }

        // Lock row in PostgreSQL to prevent race-condition overselling
        const produceRes = await client.query(
          'SELECT * FROM produce_listings WHERE id = $1 FOR UPDATE',
          [produceId]
        );

        if (produceRes.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({
            error: `Produce item '${item.name || produceId}' is no longer available in the catalog.`,
          });
        }

        const produce = produceRes.rows[0];

        if (produce.status !== 'Active') {
          await client.query('ROLLBACK');
          return res.status(409).json({
            error: `Produce item '${produce.name}' is currently marked as ${produce.status} and cannot be ordered.`,
          });
        }

        const availableQty = parseFloat(produce.quantity_available);
        if (availableQty < requestedQty) {
          await client.query('ROLLBACK');
          return res.status(409).json({
            error: `Insufficient inventory for '${produce.name}'. Requested ${requestedQty} ${produce.unit}, but only ${availableQty} ${produce.unit} is available.`,
          });
        }

        // Authoritative server-side price from PostgreSQL
        const trustedUnitPrice = parseFloat(produce.price);
        const itemSubtotal = trustedUnitPrice * requestedQty;
        serverSubtotal += itemSubtotal;

        let primaryImage = '';
        try {
          const parsedImages = Array.isArray(produce.images) ? produce.images : JSON.parse(produce.images || '[]');
          primaryImage = parsedImages.length > 0 ? parsedImages[0] : (item.image || '');
        } catch {
          primaryImage = item.image || '';
        }

        verifiedItems.push({
          produceId: produce.id,
          farmerId: produce.farmer_id || null,
          farmerName: produce.farmer_name || 'Direct Farm',
          name: produce.name,
          image: primaryImage,
          quantity: requestedQty,
          unit: produce.unit,
          unitPrice: trustedUnitPrice,
          subtotal: itemSubtotal,
        });

        // Decrement inventory atomically
        const newAvailableQty = availableQty - requestedQty;
        const newStatus = newAvailableQty <= 0 ? 'Sold Out' : 'Active';

        await client.query(
          `UPDATE produce_listings
           SET quantity_available = $1, status = $2, updated_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [newAvailableQty, newStatus, produce.id]
        );
      }

      // 2. Authoritative server-side delivery fee calculation
      const method = deliveryMethod === 'Farm Pickup' ? 'Farm Pickup' : 'Home Delivery';
      // Home delivery is ?15 flat, or ?0 for pickup / large orders > ?500
      const serverDeliveryFee = method === 'Farm Pickup' ? 0 : (serverSubtotal >= 500 ? 0 : 15.00);
      const serverTotal = serverSubtotal + serverDeliveryFee;

      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const orderId = `AV-2026-${randomSuffix}`;
      const pMethod = paymentMethod || 'Cash on Delivery';
      const estimated = `Scheduled for ${preferredDeliveryDate}`;

      // 3. Insert order record
      const orderSql = `
        INSERT INTO orders (
          id, customer_id, customer_name, customer_email, customer_phone, total_amount,
          delivery_fee, subtotal, delivery_method, delivery_address,
          preferred_delivery_date, payment_method, payment_status, order_status,
          estimated_delivery
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        ) RETURNING *;
      `;

      const orderResult = await client.query(orderSql, [
        orderId,
        user.id,
        user.name,
        user.email.toLowerCase(),
        customerPhone || '',
        serverTotal,
        serverDeliveryFee,
        serverSubtotal,
        method,
        deliveryAddress || (method === 'Home Delivery' ? '' : 'Farm Pickup'),
        preferredDeliveryDate,
        pMethod,
        'Pending',
        'Placed',
        estimated,
      ]);

      // 4. Insert verified order items
      const insertedItems: any[] = [];
      for (const vi of verifiedItems) {
        const itemId = `ITEM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        const itemSql = `
          INSERT INTO order_items (
            id, order_id, produce_id, farmer_id, farmer_name, name, image,
            quantity, unit, unit_price, subtotal
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
          ) RETURNING *;
        `;

        const itemRes = await client.query(itemSql, [
          itemId,
          orderId,
          vi.produceId,
          vi.farmerId,
          vi.farmerName,
          vi.name,
          vi.image,
          vi.quantity,
          vi.unit,
          vi.unitPrice,
          vi.subtotal,
        ]);

        insertedItems.push(itemRes.rows[0]);
      }

      await client.query('COMMIT');
      res.status(201).json(formatOrderRow(orderResult.rows[0], insertedItems));
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release();
    }
  }
);

// PATCH /api/orders/:id/status - Protected (Farmer/Admin only with crop participation verification)
router.patch('/:id/status', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user!;

    const validStatuses = ['Placed', 'Harvesting', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: `Order ${id} not found` });
    }

    const itemsResult = await query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    const items = itemsResult.rows;

    const isFarmerVendor = items.some(
      (item) =>
        (item.farmer_id && item.farmer_id === user.id) ||
        (item.farmer_name && item.farmer_name.toLowerCase() === user.name.toLowerCase())
    );

    if (user.role !== 'admin' && !isFarmerVendor) {
      return res.status(403).json({
        error: 'Access denied: Only participating farmers or administrators can update order status.',
      });
    }

    const updateSql = `
      UPDATE orders
      SET order_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const result = await query(updateSql, [status, id]);
    res.json(formatOrderRow(result.rows[0], items));
  } catch (err) {
    next(err);
  }
});

export default router;
