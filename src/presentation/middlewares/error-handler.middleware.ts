import { ErrorRequestHandler } from 'express';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  ValidationError,
} from '../../domain/errors/domain-errors.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({
      error: 'Not Found',
      message: err.message,
    });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({
      error: 'Validation Error',
      message: err.message,
    });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(409).json({
      error: 'Conflict',
      message: err.message,
    });
    return;
  }

  if (err instanceof DomainError) {
    res.status(400).json({
      error: 'Domain Error',
      message: err.message,
    });
    return;
  }

  console.error('Unhandled internal server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred.',
  });
};
