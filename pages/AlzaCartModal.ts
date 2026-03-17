import { type Page, type Locator, expect } from '@playwright/test';

export class AlzaCartModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly continueShoppingButton: Locator;
  readonly goToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('[role="dialog"]');
    this.title = this.dialog.locator('#cross-popup-dialog-title');
    this.continueShoppingButton = this.dialog.getByRole('button', { name: 'Pokračovat v nákupu' });
    this.goToCartButton = this.dialog.getByRole('button', { name: 'Pokračovat do košíku' });
  }

  async verifyVisible() {
    await expect(this.title).toBeVisible();
  }

  async continueShopping() {
    await expect(this.continueShoppingButton).toBeVisible();
    await this.continueShoppingButton.click();
    await expect(this.continueShoppingButton).toBeHidden();
  }

  async goToCart() {
    await expect(this.goToCartButton).toBeVisible();
    await this.goToCartButton.click();
  }
}
