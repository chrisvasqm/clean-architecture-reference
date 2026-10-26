import { Router } from 'express';
import { CreateProductController } from '../controllers/create-product.controller.js';
import { DeleteProductController } from '../controllers/delete-product.controller.js';
import { GetProductController } from '../controllers/get-product.controller.js';
import { ListProductsController } from '../controllers/list-products.controller.js';
import { UpdateProductController } from '../controllers/update-product.controller.js';

export interface ProductControllers {
  create: CreateProductController;
  getById: GetProductController;
  list: ListProductsController;
  update: UpdateProductController;
  delete: DeleteProductController;
}

export function createProductRouter(controllers: ProductControllers): Router {
  const router = Router();

  router.get('/', controllers.list.handle);
  router.get('/:id', controllers.getById.handle);
  router.post('/', controllers.create.handle);
  router.put('/:id', controllers.update.handle);
  router.delete('/:id', controllers.delete.handle);

  return router;
}
