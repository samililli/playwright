import { type Page, type Locator, expect } from '@playwright/test';
import { parsePrice } from './utils';

export interface ProductInfo {
  name: string;
  price: number;
  code: string;
}

export class AlzaProductPage {
  readonly page: Page;
  readonly title: Locator;
  readonly price: Locator;
  readonly code: Locator;
  readonly buyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1.h1-placeholder');
    this.price = page.locator('[data-testid="price-primary"] span.price-box__primary-price__value');
    this.code = page.locator('[data-testid="more-info-product-code"] [data-testid="value"]');
    this.buyButton = page.locator('[data-testid="component-buyButton"] button');
  }

  async getProductInfo(): Promise<ProductInfo> {
    await expect(this.title).toBeVisible();
    return {
      name: (await this.title.textContent())?.trim() || '',
      price: parsePrice((await this.price.textContent()) || ''),
      code: (await this.code.textContent())?.trim() || '',
    };
  }

  async addToCart() {
    await expect(this.buyButton).toBeVisible();
    await this.buyButton.scrollIntoViewIfNeeded();
    await this.buyButton.click();
  }
}
