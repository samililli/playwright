import { type Page, type Locator, expect } from '@playwright/test';

export class AlzaSearchResultsPage {
  readonly page: Page;
  readonly inStockFilter: Locator;
  readonly sortBySales: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inStockFilter = page.locator('[data-testid="alza-branches"] label');
    this.sortBySales = page.locator('a[data-sort-name="Sales"]');
  }

  getProductLink(index: number): Locator {
    return this.page.locator('#boxes .js-box').nth(index).locator('a.name.browsinglink');
  }

  async filterInStock() {
    await expect(this.inStockFilter).toBeVisible();
    const isChecked = await this.inStockFilter.locator('input').isChecked();
    if (!isChecked) {
      await this.inStockFilter.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async sortByBestSelling(urlPattern: RegExp) {
    await expect(this.sortBySales).toBeVisible();
    await this.sortBySales.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(urlPattern);
  }

  async openProduct(index: number) {
    const productLink = this.getProductLink(index);
    await expect(productLink).toBeVisible();
    await productLink.click();
  }
}
