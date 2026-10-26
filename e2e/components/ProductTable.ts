import { expect, type Locator, type Page } from '@playwright/test';
import { ProductFormSheet } from './ProductFormSheet.js';

export class ProductRow {
  constructor(
    private readonly page: Page,
    private readonly productName: string
  ) {}

  private get root(): Locator {
    return this.page.getByRole('row').filter({ hasText: this.productName });
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.root).toHaveCount(0);
  }

  async expectPrice(price: number): Promise<void> {
    await expect(this.root).toContainText(`$${price.toFixed(2)}`);
  }

  async expectStock(stock: number): Promise<void> {
    await expect(this.root).toContainText(`${stock} units`);
  }

  async edit(): Promise<ProductFormSheet> {
    await this.root.getByRole('button', { name: 'Edit Product' }).click();

    const form = ProductFormSheet.forEdit(this.page);
    await form.expectVisible();
    return form;
  }

  async delete(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.root.getByRole('button', { name: 'Delete Product' }).click();
  }
}

export class ProductTable {
  constructor(private readonly page: Page) {}

  row(productName: string): ProductRow {
    return new ProductRow(this.page, productName);
  }

  get visibleRowCount(): Promise<number> {
    return this.page.locator('tbody tr').count();
  }

  async expectVisibleRowCount(count: number): Promise<void> {
    await expect
      .poll(async () => this.page.locator('tbody tr').count())
      .toBe(count);
  }
}
