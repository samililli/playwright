import { type Page, type Locator, expect } from '@playwright/test';
import { parsePrice } from './utils';

export class AlzaCartPage {
  readonly page: Page;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalPrice = page.locator('span.last.price');
  }

  // Lokátory košíku – bez data-testid, založeny na CSS třídách
  getProductRow(code: string): Locator {
    return this.page.locator(`div.tr[data-code="${code}"]`);
  }

  async verifyProduct(code: string, expectedName: string, expectedPrice: number) {
    const row = this.getProductRow(code);
    await expect(row.locator('a.mainItem')).toContainText(expectedName);
    await expect(row.locator('span.c1x')).toContainText(code);
    const rowPrice = parsePrice((await row.locator('div.c5').textContent()) || '');
    expect(rowPrice).toBe(expectedPrice);
  }

  async verifyTotalPrice(expectedTotal: number) {
    const total = parsePrice((await this.totalPrice.textContent()) || '');
    expect(total).toBe(expectedTotal);
  }
}
