import { createApp } from './app.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case.js';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { InMemoryProductRepository } from './infrastructure/repositories/in-memory-product.repository.js';
import { ProductController } from './presentation/controllers/product.controller.js';

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

// 3. Presentation Layer
const productController = new ProductController(
  createProductUseCase,
  getProductUseCase,
  listProductsUseCase,
  updateProductUseCase,
  deleteProductUseCase
);

// 4. Composition Root
const app = createApp(productController);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/health`);
  console.log(`👉 Products API: http://localhost:${PORT}/api/products`);
});
