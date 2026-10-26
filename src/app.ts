import express, { Express } from 'express';
import { errorHandler } from './presentation/middlewares/error-handler.middleware.js';
import { createProductRouter, ProductControllers } from './presentation/routes/product.routes.js';

export function createApplication(productControllers: ProductControllers): Express {
  const application = express();

  application.use(express.json());

  // Health check
  application.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  application.use('/api/products', createProductRouter(productControllers));

  // Fallback 404 for undefined routes
  application.use((_request, response) => {
    response.status(404).json({ error: 'Not Found', message: 'Route does not exist' });
  });

  // Centralized error handler
  application.use(errorHandler);

  return application;
}
