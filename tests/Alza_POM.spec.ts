import { test, expect } from '@playwright/test';
import { AlzaHomePage } from '../pages/AlzaHomePage';
import { AlzaSearchResultsPage } from '../pages/AlzaSearchResultsPage';
import { AlzaProductPage, type ProductInfo } from '../pages/AlzaProductPage';
import { AlzaCartModal } from '../pages/AlzaCartModal';
import { AlzaCartPage } from '../pages/AlzaCartPage';

test.describe('Alza POM cvičení', () => {
  test.describe.configure({ timeout: 60000 });
  const baseUrl = 'https://www.alza.cz/';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    const homePage = new AlzaHomePage(page);
    await homePage.rejectCookies();
  });

  test('Nákup - happy scénář', async ({ page }) => {
    const homePage = new AlzaHomePage(page);
    const searchResults = new AlzaSearchResultsPage(page);
    const productPage = new AlzaProductPage(page);
    const cartModal = new AlzaCartModal(page);
    const cartPage = new AlzaCartPage(page);

    let itemsAdded = 0;
    const products: ProductInfo[] = [];

    // #1a) Ověření, že se stránka načetla
    await homePage.verifyPageLoaded(baseUrl);

    // #1b) Vyhledání produktu "notebook"
    await homePage.search('notebook', true); // enter pouze u prvního hledání, dále searchButton kvůli našeptávači
    await expect(page).toHaveURL(/notebook/);
    await searchResults.filterInStock();
    await searchResults.sortByBestSelling(/nejprodavanejsi-nejlepsi-notebooky/);

    // #1c) Otevření 1. produktu v seznamu
    await searchResults.openProduct(0);
    const notebook = await productPage.getProductInfo();
    products.push(notebook);

    // #1d) Přidání produktu do košíku
    await productPage.addToCart();
    await cartModal.verifyVisible();
    itemsAdded++;
    await cartModal.continueShopping();

    // #1e) Vyhledání produktu "bezdrátová myš"
    await homePage.search('bezdrátová myš');
    await expect(page).toHaveURL(/bezdratova/);
    await searchResults.filterInStock();
    await searchResults.sortByBestSelling(/nejprodavanejsi-nejlepsi-bezdratove-mysi/);

    // #1f) Otevření 2. produktu v seznamu
    await searchResults.openProduct(1);
    const mouse = await productPage.getProductInfo();
    products.push(mouse);

    // #1g) Přidání produktu do košíku
    await productPage.addToCart();
    await cartModal.verifyVisible();
    itemsAdded++;
    await cartModal.continueShopping();

    // #1h) Vyhledání produktu "monitor"
    await homePage.search('monitor');
    await expect(page).toHaveURL(/monitor/);
    await searchResults.filterInStock();
    await searchResults.sortByBestSelling(/nejprodavanejsi-nejlepsi-lcd-monitory/);

    // #1i) Otevření 3. produktu v seznamu
    await searchResults.openProduct(2);
    const monitor = await productPage.getProductInfo();
    products.push(monitor);

    // #1j) Přidání produktu do košíku
    await productPage.addToCart();
    await cartModal.verifyVisible();
    itemsAdded++;
    await cartModal.continueShopping();

    // #1k) Ověření správného počtu přidaných položek u ikony košíku
    await homePage.verifyCartItemCount(itemsAdded);

    // #1l) Otevření nákupního košíku
    await homePage.openCart();

    // Ověření, že se v košíku nachází všechny 3 produkty s jejich správnými názvy, cenami a kódy.
    for (const product of products) {
      await cartPage.verifyProduct(product.code, product.name, product.price);
    }

    // #1m) Ověření, že celková cena košíku odpovídá součtu uložených cen produktů.
    const expectedTotalPrice = products.reduce((sum, p) => sum + p.price, 0);
    await cartPage.verifyTotalPrice(expectedTotalPrice);
  });
});
