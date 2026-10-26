import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';

export function createProductRouter(controller: ProductController): Router {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
