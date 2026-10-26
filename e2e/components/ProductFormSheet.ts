import { expect, type Locator, type Page } from '@playwright/test';

export interface ProductFormInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export class ProductFormSheet {
  private constructor(private readonly root: Locator) {}

  static forCreate(page: Page): ProductFormSheet {
    return new ProductFormSheet(
      page.getByRole('dialog', { name: 'Add New Product' })
    );
  }

  static forEdit(page: Page): ProductFormSheet {
    return new ProductFormSheet(
      page.getByRole('dialog', { name: 'Edit Product' })
    );
  }

  async fill(input: ProductFormInput): Promise<void> {
    await this.root.getByLabel('Product Name').fill(input.name);

    if (input.description !== undefined) {
      await this.root.getByLabel('Description').fill(input.description);
    }

    await this.root.getByLabel('Price ($)').fill(String(input.price));
    await this.root.getByLabel('Stock Quantity').fill(String(input.stock));
  }

  async submit(): Promise<void> {
    await this.root
      .getByRole('button', { name: /^(Create Product|Save Changes)$/ })
      .click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }
}
