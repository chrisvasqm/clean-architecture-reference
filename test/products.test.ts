import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { createApplication } from '../src/app.js';
import { CreateProductUseCase } from '../src/application/use-cases/create-product.use-case.js';
import { DeleteProductUseCase } from '../src/application/use-cases/delete-product.use-case.js';
import { GetProductUseCase } from '../src/application/use-cases/get-product.use-case.js';
import { ListProductsUseCase } from '../src/application/use-cases/list-products.use-case.js';
import { UpdateProductUseCase } from '../src/application/use-cases/update-product.use-case.js';
import { InMemoryProductRepository } from '../src/infrastructure/repositories/in-memory-product.repository.js';
import { CreateProductController } from '../src/presentation/controllers/create-product.controller.js';
import { DeleteProductController } from '../src/presentation/controllers/delete-product.controller.js';
import { GetProductController } from '../src/presentation/controllers/get-product.controller.js';
import { ListProductsController } from '../src/presentation/controllers/list-products.controller.js';
import { UpdateProductController } from '../src/presentation/controllers/update-product.controller.js';
import { Product } from '../src/domain/entities/product.entity.js';

describe('Products API', () => {
  let application: Express;
  let repository: InMemoryProductRepository;
  const initialProducts: Product[] = [
    {
      id: '1',
      name: 'Mechanical Keyboard',
      description: 'Hot-swappable RGB keyboard',
      price: 99.99,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      description: 'Ergonomic optical mouse',
      price: 49.99,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    repository = new InMemoryProductRepository(initialProducts);
    const controllers = {
      create: new CreateProductController(new CreateProductUseCase(repository)),
      getById: new GetProductController(new GetProductUseCase(repository)),
      list: new ListProductsController(new ListProductsUseCase(repository)),
      update: new UpdateProductController(new UpdateProductUseCase(repository)),
      delete: new DeleteProductController(new DeleteProductUseCase(repository)),
    };
    application = createApplication(controllers);
  });

  describe('GET /health', () => {
    it('should return 200 and healthy status', async () => {
      const response = await request(application).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/products', () => {
    it('should return all products and total count', async () => {
      const response = await request(application).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      expect(response.body.data[0].name).toBe('Mechanical Keyboard');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product and return 201', async () => {
      const payload = {
        name: 'Noise-Cancelling Headphones',
        description: 'Wireless over-ear headphones',
        price: 199.99,
        stock: 15,
      };

      const response = await request(application).post('/api/products').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product created successfully');
      expect(response.body.data).toMatchObject({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        stock: payload.stock,
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 when name is missing or too short', async () => {
      const response = await request(application).post('/api/products').send({
        name: '',
        price: 50,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Product name is required');
    });

    it('should return 400 when price is negative', async () => {
      const response = await request(application).post('/api/products').send({
        name: 'Monitor Stand',
        price: -10,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('non-negative number');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return the product when found', async () => {
      const response = await request(application).get('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
        id: '1',
        name: 'Mechanical Keyboard',
        price: 99.99,
      });
    });

    it('should return 404 when product is not found', async () => {
      const response = await request(application).get('/api/products/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toContain('was not found');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update the product and return 200', async () => {
      const updatePayload = {
        price: 89.99,
        stock: 35,
      };

      const response = await request(application)
        .put('/api/products/1')
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated successfully');
      expect(response.body.data.price).toBe(89.99);
      expect(response.body.data.stock).toBe(35);
      expect(response.body.data.name).toBe('Mechanical Keyboard');
    });

    it('should return 404 when updating non-existent product', async () => {
      const response = await request(application)
        .put('/api/products/non-existent-id')
        .send({ price: 100 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });

    it('should return 400 when updating with invalid values', async () => {
      const response = await request(application)
        .put('/api/products/1')
        .send({ price: -25 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete the product and return 200', async () => {
      const response = await request(application).delete('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted successfully');

      // Verify it's no longer retrievable
      const getResponse = await request(application).get('/api/products/1');
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent product', async () => {
      const response = await request(application).delete('/api/products/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });
});
