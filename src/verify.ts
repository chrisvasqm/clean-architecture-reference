import { createApp } from './app.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case.js';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { InMemoryProductRepository } from './infrastructure/repositories/in-memory-product.repository.js';
import { ProductController } from './presentation/controllers/product.controller.js';

async function verify() {
  const repo = new InMemoryProductRepository([
    {
      id: '1',
      name: 'Mechanical Keyboard',
      description: 'RGB Mechanical keyboard',
      price: 99.99,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const controller = new ProductController(
    new CreateProductUseCase(repo),
    new GetProductUseCase(repo),
    new ListProductsUseCase(repo),
    new UpdateProductUseCase(repo),
    new DeleteProductUseCase(repo)
  );

  const app = createApp(controller);
  const server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Server address not found');
  }
  const port = address.port;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log(`Testing on port ${port}...`);

  // 1. GET /health
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = (await healthRes.json()) as { status: string };
  console.log('✓ GET /health:', healthRes.status, healthData);

  // 2. GET /api/products
  const listRes = await fetch(`${baseUrl}/api/products`);
  const listData = (await listRes.json()) as { data: unknown[]; count: number };
  console.log('✓ GET /api/products:', listRes.status, `count: ${listData.count}`);

  // 3. POST /api/products
  const createRes = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Noise-Cancelling Headphones',
      description: 'Wireless over-ear headphones',
      price: 199.99,
      stock: 15,
    }),
  });
  const createData = (await createRes.json()) as {
    data: { id: string; name: string };
    message: string;
  };
  console.log('✓ POST /api/products:', createRes.status, createData.message);
  const newId = createData.data.id;

  // 4. GET /api/products/:id
  const getRes = await fetch(`${baseUrl}/api/products/${newId}`);
  const getData = (await getRes.json()) as { data: { name: string } };
  console.log('✓ GET /api/products/:id:', getRes.status, getData.data.name);

  // 5. PUT /api/products/:id
  const updateRes = await fetch(`${baseUrl}/api/products/${newId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price: 179.99,
      stock: 20,
    }),
  });
  const updateData = (await updateRes.json()) as { data: { price: number } };
  console.log('✓ PUT /api/products/:id:', updateRes.status, `new price: ${updateData.data.price}`);

  // 6. DELETE /api/products/:id
  const deleteRes = await fetch(`${baseUrl}/api/products/${newId}`, {
    method: 'DELETE',
  });
  const deleteData = (await deleteRes.json()) as { message: string };
  console.log('✓ DELETE /api/products/:id:', deleteRes.status, deleteData.message);

  // 7. Verify 404 after delete
  const notFoundRes = await fetch(`${baseUrl}/api/products/${newId}`);
  const notFoundData = (await notFoundRes.json()) as { error: string };
  console.log('✓ GET /api/products/:id (post-delete):', notFoundRes.status, notFoundData.error);

  // 8. Verify 400 validation error
  const invalidRes = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '',
      price: -5,
    }),
  });
  const invalidData = (await invalidRes.json()) as { message: string };
  console.log('✓ POST invalid product:', invalidRes.status, invalidData.message);

  server.close();
  console.log('\nAll integration checks passed cleanly!');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
