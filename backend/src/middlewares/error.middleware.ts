import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    err: {
      message: err.message,
      name: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  }, 'Request Error');

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(err instanceof AppError && err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV === 'development' && !(err instanceof AppError)
      ? { stack: err.stack }
      : {}),
  });
};
