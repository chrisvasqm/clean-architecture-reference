import { test } from '@playwright/test';
import { CatalogPage } from './pages/CatalogPage.js';

interface ProductRecord {
  id: string;
  name: string;
}

const productNamePrefix = `Playwright E2E ${Date.now()}`;

test.afterEach(async ({ request }) => {
  const response = await request.get('/api/products');
  if (!response.ok()) return;

  const payload = (await response.json()) as { data: ProductRecord[] };
  const createdProducts = payload.data.filter((product) =>
    product.name.startsWith(productNamePrefix)
  );

  await Promise.all(
    createdProducts.map((product) =>
      request.delete(`/api/products/${product.id}`)
    )
  );
});

test('loads the product catalog dashboard', async ({ page }) => {
  const catalog = new CatalogPage(page);

  await catalog.open();
  await catalog.expectReady();
});

test('creates, edits, searches for, and deletes a product', async ({ page }) => {
  const originalName = `${productNamePrefix} Product`;
  const updatedName = `${originalName} Updated`;
  const catalog = new CatalogPage(page);

  await catalog.open();
  await catalog.expectReady();

  const createForm = await catalog.openNewProduct();
  await createForm.fill({
    name: originalName,
    description: 'Created by Playwright',
    price: 42.5,
    stock: 12,
  });
  await createForm.submit();
  await catalog.toast.expectMessage(`"${originalName}" added successfully`);

  const createdRow = catalog.table.row(originalName);
  await createdRow.expectVisible();

  const editForm = await createdRow.edit();
  await editForm.fill({
    name: updatedName,
    price: 55.75,
    stock: 4,
  });
  await editForm.submit();
  await catalog.toast.expectMessage(`"${updatedName}" updated successfully`);

  const updatedRow = catalog.table.row(updatedName);
  await updatedRow.expectVisible();
  await updatedRow.expectPrice(55.75);
  await updatedRow.expectStock(4);

  await catalog.search(updatedName);
  await catalog.table.expectVisibleRowCount(1);

  await updatedRow.delete();
  await catalog.toast.expectMessage(`"${updatedName}" deleted`);
  await updatedRow.expectHidden();
});
