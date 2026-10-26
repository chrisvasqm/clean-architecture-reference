import { expect, type Page } from '@playwright/test';
import { ProductFormSheet } from '../components/ProductFormSheet.js';
import { ProductTable } from '../components/ProductTable.js';
import { Toast } from '../components/Toast.js';

export class CatalogPage {
  readonly table: ProductTable;
  readonly toast: Toast;

  constructor(private readonly page: Page) {
    this.table = new ProductTable(page);
    this.toast = new Toast(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async expectReady(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { level: 1, name: 'Products' })
    ).toBeVisible();
    await expect(
      this.page.getByRole('button', { name: 'New Product' })
    ).toBeVisible();
    await expect(
      this.page.getByRole('textbox', { name: 'Search products' })
    ).toBeVisible();
    await expect(
      this.page.getByRole('button', { name: 'All', exact: true })
    ).toBeVisible();
  }

  async openNewProduct(): Promise<ProductFormSheet> {
    await this.page.getByRole('button', { name: 'New Product' }).click();

    const form = ProductFormSheet.forCreate(this.page);
    await form.expectVisible();
    return form;
  }

  async search(term: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Search products' }).fill(term);
  }
}
