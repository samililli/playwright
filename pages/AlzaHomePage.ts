import { type Page, type Locator, expect } from '@playwright/test';

export class AlzaHomePage {
  readonly page: Page;
  readonly header: Locator;
  readonly cookiesRejectButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartItemCount: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('[data-testid="component-header"]');
    this.cookiesRejectButton = page.locator('a.js-cookies-info-reject');
    this.searchInput = page.locator('input[data-testid="searchInput"]');
    this.searchButton = page.locator('button[data-testid="button-search"]');
    this.cartItemCount = page.locator('[data-testid="headerBasketIcon"] span');
    this.cartIcon = page.locator('[data-testid="headerBasketIcon"]');
  }

  async rejectCookies() {
    await expect(this.cookiesRejectButton).toBeVisible();
    await this.cookiesRejectButton.click();
    await expect(this.cookiesRejectButton).toBeHidden();
  }

  async verifyPageLoaded(baseUrl: string) {
    await expect(this.header).toBeVisible();
    await expect(this.page).toHaveURL(baseUrl);
  }

  async search(term: string, useEnter = false) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.clear();
    await this.searchInput.fill(term);
    await expect(this.searchInput).toHaveValue(term);
    if (useEnter) {
      await this.searchInput.press('Enter');
    } else {
      await this.searchButton.click();
    }
  }

  async verifyCartItemCount(count: number) {
    await expect(this.cartItemCount).toHaveText(String(count));
  }

  async openCart() {
    await expect(this.cartIcon).toBeVisible();
    await this.cartIcon.click();
  }
}
