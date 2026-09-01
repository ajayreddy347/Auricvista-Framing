import { Request, Response, NextFunction } from 'express';

export function validateProduceInput(req: Request, res: Response, next: NextFunction) {
  const { name, category, price, pricePerUnit, quantity, farmLocation } = req.body;
  const errors: string[] = [];

  const rawPrice = price !== undefined ? price : pricePerUnit;

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Product name is required');
  }
  if (!category || typeof category !== 'string') {
    errors.push('Category is required');
  }
  if (rawPrice === undefined || isNaN(Number(rawPrice)) || Number(rawPrice) < 0) {
    errors.push('Valid price per unit is required');
  }
  if (quantity !== undefined && (isNaN(Number(quantity)) || Number(quantity) < 0)) {
    errors.push('Quantity must be a non-negative number');
  }
  if (!farmLocation || typeof farmLocation !== 'string' || !farmLocation.trim()) {
    errors.push('Farm location is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

export function validateOrderInput(req: Request, res: Response, next: NextFunction) {
  const { items, customerName, customerEmail, preferredDeliveryDate } = req.body;
  const errors: string[] = [];

  const cName = customerName || req.user?.name;
  const cEmail = customerEmail || req.user?.email;

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least 1 item');
  }
  if (!cName || typeof cName !== 'string' || !cName.trim()) {
    errors.push('Customer name is required');
  }
  if (!cEmail || typeof cEmail !== 'string' || !cEmail.includes('@')) {
    errors.push('Valid customer email is required');
  }
  if (!preferredDeliveryDate) {
    errors.push('Preferred delivery date is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

export function validateReviewInput(req: Request, res: Response, next: NextFunction) {
  const { farmerId, customerName, rating, comment } = req.body;
  const errors: string[] = [];

  const cName = customerName || req.user?.name;

  if (!farmerId || typeof farmerId !== 'string') {
    errors.push('Farmer ID is required');
  }
  if (!cName || typeof cName !== 'string' || !cName.trim()) {
    errors.push('Customer name is required');
  }
  if (rating === undefined || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    errors.push('Rating must be a number between 1.0 and 5.0');
  }
  if (!comment || typeof comment !== 'string' || !comment.trim()) {
    errors.push('Review comment is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}
