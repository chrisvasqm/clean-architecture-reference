import { expect, type Page } from '@playwright/test';

export class Toast {
  constructor(private readonly page: Page) {}

  async expectMessage(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
