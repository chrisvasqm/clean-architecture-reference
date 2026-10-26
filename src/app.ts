import express, { Express } from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { errorHandler } from './presentation/middlewares/error-handler.middleware.js';
import { createProductRouter, ProductControllers } from './presentation/routes/product.routes.js';

export interface ApplicationOptions {
  clientDistPath?: string;
}

export function createApplication(
  productControllers: ProductControllers,
  options: ApplicationOptions = {},
): Express {
  const application = express();

  application.use(cors());
  application.use(express.json());

  // Health check
  application.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  application.use('/api/products', createProductRouter(productControllers));

  // Serve static client assets if client/dist exists
  const clientDistPath = options.clientDistPath ?? path.resolve(process.cwd(), 'client', 'dist');
  if (fs.existsSync(clientDistPath)) {
    application.use(express.static(clientDistPath));
    application.get('/', (_request, response) => {
      response.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  // Fallback 404 for undefined routes
  application.use((_request, response) => {
    response.status(404).json({ error: 'Not Found', message: 'Route does not exist' });
  });

  // Centralized error handler
  application.use(errorHandler);

  return application;
}
