import { test, expect } from '@playwright/test';

test.describe('Alza', () => {

  test('Alza nákup', async ({ page }) => {
    test.setTimeout(60000);
    const parsePrice = (price: string): number => {
      const result = parseInt(price.replace(/\D/g, ''));
      if (isNaN(result)) throw new Error(`Nepodařilo se naparsovat cenu: "${price}"`);
      return result;
    };

    let itemsAdded = 0;
    const baseUrl = 'https://www.alza.cz/';
    const cookiesRejectButton = page.locator('a.js-cookies-info-reject');
    const header = page.locator('[data-testid="component-header"]');
    const searchInput = page.locator('input[data-testid="searchInput"]');
    const searchButton = page.locator('button[data-testid="button-search"]');
    const inStockFilter = page.locator('[data-testid="alza-branches"] label');
    const sortBySales = page.locator('a[data-sort-name="Sales"]');
    const firstProductLink = page.locator('#boxes .js-box').first().locator('a.name.browsinglink');
    const productTitle = page.locator('h1.h1-placeholder');
    const productPrice = page.locator('[data-testid="price-primary"] span.price-box__primary-price__value');
    const productCode = page.locator('[data-testid="more-info-product-code"] [data-testid="value"]');
    const buyButton = page.locator('[data-testid="component-buyButton"] button');
    const cartDialog = page.locator('[role="dialog"]');
    const cartModal = cartDialog.locator('#cross-popup-dialog-title');
    const continueShoppingButton = cartDialog.getByRole('button', { name: 'Pokračovat v nákupu' });
    const secondProductLink = page.locator('#boxes .js-box').nth(1).locator('a.name.browsinglink');
    const thirdProductLink = page.locator('#boxes .js-box').nth(2).locator('a.name.browsinglink');
    const cartItemCount = page.locator('[data-testid="headerBasketIcon"] span');
    const cartIcon = page.locator('[data-testid="headerBasketIcon"]');
    
    const clickBuyButton = async () => {
      await expect(buyButton).toBeVisible();
      await buyButton.scrollIntoViewIfNeeded();
      await buyButton.click();
      await expect(cartModal).toBeVisible();
    };

    // #1a) Otevření stránky Alza.cz
    await page.goto(baseUrl);
    // Odmítnutí cookies okna
    await expect(cookiesRejectButton).toBeVisible();
    await cookiesRejectButton.click();
    await expect(cookiesRejectButton).toBeHidden();
    // Ověření, že se stránka načetla
    await expect(header).toBeVisible();
    await expect(page).toHaveURL(baseUrl);


    // #1b) Vyhledání produktu "notebook"
    await expect(searchInput).toBeVisible();
    await searchInput.clear();
    await searchInput.fill('notebook');
    await expect(searchInput).toHaveValue('notebook');
    await searchInput.press('Enter'); // enter pouze u prvního hledání, dále searchButton kvůli našeptávači
    await expect(page).toHaveURL(/notebook/);
    // Filtrování výsledků – pouze produkty skladem
    await expect(inStockFilter).toBeVisible();
    const isCheckedNotebook = await inStockFilter.locator('input').isChecked();
    if (!isCheckedNotebook) {
      await inStockFilter.click();
      await page.waitForLoadState('networkidle');
    }
    // Seřazení výsledků dle nejprodávanějších
    await expect(sortBySales).toBeVisible();
    await sortBySales.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/nejprodavanejsi-nejlepsi-notebooky/);


    // #1c) Otevření 1. produktu v seznamu
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();
    // Uložení proměnné názvu, ceny a kódu produktu
    await expect(productTitle).toBeVisible();
    const notebookName = (await productTitle.textContent())?.trim() || '';
    const notebookPrice = parsePrice((await productPrice.textContent()) || '');
    const notebookCode = (await productCode.textContent())?.trim() || '';


    // #1d) Přidání produktu do košíku
    await clickBuyButton();
    itemsAdded++;
    // Zavření modálního okna a pokračování v nákupu
    await expect(continueShoppingButton).toBeVisible();
    await continueShoppingButton.click();
    await expect(continueShoppingButton).toBeHidden();


    // #1e) Vyhledání produktu "bezdrátová myš"
    await expect(searchInput).toBeVisible();
    await searchInput.clear();
    await searchInput.fill('bezdrátová myš');
    await expect(searchInput).toHaveValue('bezdrátová myš');
    await searchButton.click();
    await expect(page).toHaveURL(/bezdratova/);
    // Filtrování výsledků - pouze produkty skladem
    await expect(inStockFilter).toBeVisible();
    const isCheckedMouseFilter = await inStockFilter.locator('input').isChecked();
    if (!isCheckedMouseFilter) {
      await inStockFilter.click();
      await page.waitForLoadState('networkidle');
    }
    // Seřazení výsledků dle nejprodávanějších
    await expect(sortBySales).toBeVisible();
    await sortBySales.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/nejprodavanejsi-nejlepsi-bezdratove-mysi/);


    // #1f) Otevření 2. produktu v seznamu
    await expect(secondProductLink).toBeVisible();
    await secondProductLink.click();
    // Uložení proměnné názvu, ceny a kódu produktu
    await expect(productTitle).toBeVisible();
    const mouseName = (await productTitle.textContent())?.trim() || '';
    const mousePrice = parsePrice((await productPrice.textContent()) || '');
    const mouseCode = (await productCode.textContent())?.trim() || '';


    // #1g) Přidání produktu do košíku
    await clickBuyButton();
    itemsAdded++;
    // Zavření modálního okna a pokračování v nákupu
    await expect(continueShoppingButton).toBeVisible();
    await continueShoppingButton.click();
    await expect(continueShoppingButton).toBeHidden();


    // #1h) Vyhledání produktu "monitor"
    await expect(searchInput).toBeVisible();
    await searchInput.clear();
    await searchInput.fill('monitor');
    await expect(searchInput).toHaveValue('monitor');
    await searchButton.click();
    await expect(page).toHaveURL(/monitor/);
    // Filtrování výsledků - pouze produkty skladem
    await expect(inStockFilter).toBeVisible();
    const isCheckedMonitorFilter = await inStockFilter.locator('input').isChecked();
    if (!isCheckedMonitorFilter) {
      await inStockFilter.click();
      await page.waitForLoadState('networkidle');
    }
    // Seřazení výsledků dle nejprodávanějších
    await expect(sortBySales).toBeVisible();
    await sortBySales.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/nejprodavanejsi-nejlepsi-lcd-monitory/);


    // #1i) Otevření 3. produktu v seznamu
    await expect(thirdProductLink).toBeVisible();
    await thirdProductLink.click();
    // Uložení proměnné názvu, ceny a kódu produktu
    await expect(productTitle).toBeVisible();
    const monitorName = (await productTitle.textContent())?.trim() || '';
    const monitorPrice = parsePrice((await productPrice.textContent()) || '');
    const monitorCode = (await productCode.textContent())?.trim() || '';


    // #1j) Přidání produktu do košíku
    await clickBuyButton();
    itemsAdded++;
    // Zavření modálního okna a pokračování v nákupu
    await expect(continueShoppingButton).toBeVisible();
    await continueShoppingButton.click();
    await expect(continueShoppingButton).toBeHidden();


    // #1k) Ověření správného počtu přidaných položek u ikony košíku
    await expect(cartItemCount).toHaveText(String(itemsAdded));


    // #1l) Otevření nákupního košíku
    await expect(cartIcon).toBeVisible();
    await cartIcon.click();
    // Ověření, že se v košíku nachází všechny 3 produkty s jejich správnými názvy, cenami a kódy.
    const notebookRow = page.locator(`div.tr[data-code="${notebookCode}"]`);
    const mouseRow = page.locator(`div.tr[data-code="${mouseCode}"]`);
    const monitorRow = page.locator(`div.tr[data-code="${monitorCode}"]`);

    await expect(notebookRow.locator('a.mainItem')).toContainText(notebookName);
    await expect(notebookRow.locator('span.c1x')).toContainText(notebookCode);
    const cartNotebookPrice = parsePrice((await notebookRow.locator('div.c5').textContent()) || '');
    expect(cartNotebookPrice).toBe(notebookPrice);

    await expect(mouseRow.locator('a.mainItem')).toContainText(mouseName);
    await expect(mouseRow.locator('span.c1x')).toContainText(mouseCode);
    const cartMousePrice = parsePrice((await mouseRow.locator('div.c5').textContent()) || '');
    expect(cartMousePrice).toBe(mousePrice);

    await expect(monitorRow.locator('a.mainItem')).toContainText(monitorName);
    await expect(monitorRow.locator('span.c1x')).toContainText(monitorCode);
    const cartMonitorPrice = parsePrice((await monitorRow.locator('div.c5').textContent()) || '');
    expect(cartMonitorPrice).toBe(monitorPrice);


    // #1m) Ověření, že celková cena košíku odpovídá součtu uložených cen produktů.
    const totalPriceElement = page.locator('span.last.price');
    const cartTotalPrice = parsePrice((await totalPriceElement.textContent()) || '');
    const expectedTotalPrice = notebookPrice + mousePrice + monitorPrice;
    expect(cartTotalPrice).toBe(expectedTotalPrice);

  });

});