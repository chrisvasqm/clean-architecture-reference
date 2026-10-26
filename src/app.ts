import express, { Express } from 'express';
import { errorHandler } from './presentation/middlewares/error-handler.middleware.js';
import { createProductRouter, ProductControllers } from './presentation/routes/product.routes.js';

export function createApp(productControllers: ProductControllers): Express {
  const app = express();

  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/products', createProductRouter(productControllers));

  // Fallback 404 for undefined routes
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Route does not exist' });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}
