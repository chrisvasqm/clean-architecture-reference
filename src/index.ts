import { createApplication } from './app.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case.js';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { InMemoryProductRepository } from './infrastructure/repositories/in-memory-product.repository.js';
import { CreateProductController } from './presentation/controllers/create-product.controller.js';
import { DeleteProductController } from './presentation/controllers/delete-product.controller.js';
import { GetProductController } from './presentation/controllers/get-product.controller.js';
import { ListProductsController } from './presentation/controllers/list-products.controller.js';
import { UpdateProductController } from './presentation/controllers/update-product.controller.js';

// 1. Infrastructure Layer
const initialProducts = [
  {
    id: '1',
    name: 'Mechanical Keyboard',
    description: 'Hot-swappable mechanical keyboard with RGB backlighting',
    price: 99.99,
    stock: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Wireless Ergonomic Mouse',
    description: 'High-precision wireless mouse with thumb rest',
    price: 49.99,
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const productRepository = new InMemoryProductRepository(initialProducts);

// 2. Application Layer (Use Cases)
const createProductUseCase = new CreateProductUseCase(productRepository);
const getProductUseCase = new GetProductUseCase(productRepository);
const listProductsUseCase = new ListProductsUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

// 3. Presentation Layer (Single-Action Controllers)
const productControllers = {
  create: new CreateProductController(createProductUseCase),
  getById: new GetProductController(getProductUseCase),
  list: new ListProductsController(listProductsUseCase),
  update: new UpdateProductController(updateProductUseCase),
  delete: new DeleteProductController(deleteProductUseCase),
};

// 4. Composition Root
const application = createApplication(productControllers);
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

application.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`👉 Health check: http://localhost:${port}/health`);
  console.log(`👉 Products API: http://localhost:${port}/api/products`);
});
