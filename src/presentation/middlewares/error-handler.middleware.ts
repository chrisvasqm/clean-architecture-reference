import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  ValidationError,
} from '../../domain/errors/domain-errors.js';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _nextFunction) => {
  if (error instanceof ZodError) {
    const formatted = error.issues.map((issue) => issue.message).join('; ');
    response.status(400).json({
      error: 'Validation Error',
      message: formatted,
      details: error.issues,
    });
    return;
  }

  if (error instanceof NotFoundError) {
    response.status(404).json({
      error: 'Not Found',
      message: error.message,
    });
    return;
  }

  if (error instanceof ValidationError) {
    response.status(400).json({
      error: 'Validation Error',
      message: error.message,
    });
    return;
  }

  if (error instanceof ConflictError) {
    response.status(409).json({
      error: 'Conflict',
      message: error.message,
    });
    return;
  }

  if (error instanceof DomainError) {
    response.status(400).json({
      error: 'Domain Error',
      message: error.message,
    });
    return;
  }

  console.error('Unhandled internal server error:', error);
  response.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred.',
  });
};
