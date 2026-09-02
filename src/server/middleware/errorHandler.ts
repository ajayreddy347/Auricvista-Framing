import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[API Error] ${req.method} ${req.originalUrl} - Status: ${statusCode} - ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const safeMessage = isProduction && statusCode === 500 ? 'Internal Server Error. Please try again later.' : message;

  res.status(statusCode).json({
    error: safeMessage,
    details: !isProduction ? (err.details || undefined) : undefined,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
}
