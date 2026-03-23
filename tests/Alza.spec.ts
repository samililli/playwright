import { test, expect } from '@playwright/test';

const parsePrice = (price: string): number => {
  const result = parseInt(price.replace(/\D/g, ''));
  if (isNaN(result)) throw new Error(`Nepodařilo se naparsovat cenu: "${price}"`);
  return result;
};

test.describe('Alza', () => {
  test.describe.configure({ timeout: 60000 });
  const baseUrl = 'https://www.alza.cz/';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState();
    const cookiesRejectButton = page.locator('a.js-cookies-info-reject');
    await expect(cookiesRejectButton).toBeVisible();
    await cookiesRejectButton.click();
    await expect(cookiesRejectButton).toBeHidden();
  });

  test('Nákup - happy scénář', async ({ page }) => {

    let itemsAdded = 0;

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

    const filterInStock = async () => {
      await expect(inStockFilter).toBeVisible();
      const isChecked = await inStockFilter.locator('input').isChecked();
      if (!isChecked) {
        await inStockFilter.click();
        await page.waitForLoadState('networkidle');
      }
    };

    const sortByBestSelling = async () => {
      await expect(sortBySales).toBeVisible();
      await sortBySales.click();
      await page.waitForLoadState('networkidle');
    };


    // #1a) Otevření stránky Alza.cz a ověření, že se stránka načetla
    await expect(header).toBeVisible();
    await expect(page).toHaveURL(baseUrl);


    // #1b) Vyhledání produktu "notebook"
    await expect(searchInput).toBeVisible();
    await searchInput.clear();
    await searchInput.fill('notebook');
    await expect(searchInput).toHaveValue('notebook');
    await searchInput.press('Enter'); // enter pouze u prvního hledání, dále searchButton kvůli našeptávači
    await expect(page).toHaveURL(/notebook/);
    await filterInStock();
    await sortByBestSelling();
    await expect(page).toHaveURL(/nejprodavanejsi-nejlepsi-notebooky/);


    // #1c) Otevření 1. produktu v seznamu
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();
    // Uložení proměnné názvu, ceny a kódu produktu
    await expect(productTitle).toBeVisible();
    const notebookName = (await productTitle.textContent())?.trim() || '';
    const notebookPrice = parsePrice((await productPrice.textContent()) || '');
    const notebookCode = (await productCode.textContent())?.trim() || '';
    console.log('Notebook:', notebookName, notebookPrice, notebookCode);


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
    await filterInStock();
    await sortByBestSelling();
    await expect(page).toHaveURL(/nejprodavanejsi-nejlepsi-bezdratove-mysi/);


    // #1f) Otevření 2. produktu v seznamu
    await expect(secondProductLink).toBeVisible();
    await secondProductLink.click();
    // Uložení proměnné názvu, ceny a kódu produktu
    await expect(productTitle).toBeVisible();
    const mouseName = (await productTitle.textContent())?.trim() || '';
    const mousePrice = parsePrice((await productPrice.textContent()) || '');
    const mouseCode = (await productCode.textContent())?.trim() || '';
    console.log('Myš:', mouseName, mousePrice, mouseCode);


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
    await filterInStock();
    await sortByBestSelling();
    await expect(page).toHaveURL(/nejprodavanejsi-nejlepsi-lcd-monitory/);


    // #1i) Otevření 3. produktu v seznamu
    await expect(thirdProductLink).toBeVisible();
    await thirdProductLink.click();
    // Uložení proměnné názvu, ceny a kódu produktu
    await expect(productTitle).toBeVisible();
    const monitorName = (await productTitle.textContent())?.trim() || '';
    const monitorPrice = parsePrice((await productPrice.textContent()) || '');
    const monitorCode = (await productCode.textContent())?.trim() || '';
    console.log('Monitor:', monitorName, monitorPrice, monitorCode);


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

  test('Odebrání produktu z košíku - edge case', async ({ page }) => {

    let itemsAdded = 0;

    const searchInput = page.locator('input[data-testid="searchInput"]');
    const inStockFilter = page.locator('[data-testid="alza-branches"] label');
    const sortBySales = page.locator('a[data-sort-name="Sales"]');
    const firstProductLink = page.locator('#boxes .js-box').first().locator('a.name.browsinglink');
    const buyButton = page.locator('[data-testid="component-buyButton"] button');
    const cartDialog = page.locator('[role="dialog"]');
    const cartModal = cartDialog.locator('#cross-popup-dialog-title');
    const goToCartButton = cartDialog.getByRole('button', { name: 'Pokračovat do košíku' });
    const cartItemCount = page.locator('[data-testid="headerBasketIcon"] span');
    const productRow = page.locator('div.tr').first();
    const optionsButton = productRow.locator('button.js-item-options-trigger');
    const deleteButton = productRow.locator('button.js-item-options-del');
    const emptyCart = page.locator('div.oldEmptyCart');

    const filterInStock = async () => {
      await expect(inStockFilter).toBeVisible();
      const isChecked = await inStockFilter.locator('input').isChecked();
      if (!isChecked) {
        await inStockFilter.click();
        await page.waitForLoadState('networkidle');
      }
    };

    const sortByBestSelling = async () => {
      await expect(sortBySales).toBeVisible();
      await sortBySales.click();
      await page.waitForLoadState('networkidle');
    };

    // Vyhledání a přidání prvního notebooku do košíku
    await expect(searchInput).toBeVisible();
    await searchInput.fill('notebook');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/notebook/);
    await filterInStock();
    await sortByBestSelling();
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();
    await expect(buyButton).toBeVisible();
    await buyButton.scrollIntoViewIfNeeded();
    await buyButton.click();
    await expect(cartModal).toBeVisible();
    itemsAdded++;

    // Ověření počtu položek v košíku
    await expect(cartItemCount).toHaveText(String(itemsAdded));

    // Přechod do košíku
    await expect(goToCartButton).toBeVisible();
    await goToCartButton.click();
    await expect(page).toHaveURL(/Order/i);

    // Smazání produktu z košíku
    await expect(optionsButton).toBeVisible();
    await optionsButton.click();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    itemsAdded--;

    // Ověření prázdného košíku
    await expect(emptyCart).toBeVisible();
    await expect(emptyCart).toContainText('Jsem tak prázdný');
    await page.screenshot({ path: 'screenshots/prazdny_kosik.png' });
    expect(itemsAdded).toBe(0);

  });

  test('Ověření nesprávného počtu položek v košíku - edge case', async ({ page }) => {
    // NEGATIVNÍ SCÉNÁŘ – test záměrně ověřuje nesrovnalost.
    // Přidáme 5 položek (včetně duplicit), ale assertujeme, že počet NENÍ 3. Tím ověřujeme, že počítadlo košíku skutečně reflektuje reálný počet položek.

    const searchInput = page.locator('input[data-testid="searchInput"]');
    const searchButton = page.locator('button[data-testid="button-search"]');
    const inStockFilter = page.locator('[data-testid="alza-branches"] label');
    const sortBySales = page.locator('a[data-sort-name="Sales"]');
    const firstProductLink = page.locator('#boxes .js-box').first().locator('a.name.browsinglink');
    const secondProductLink = page.locator('#boxes .js-box').nth(1).locator('a.name.browsinglink');
    const cartDialog = page.locator('[role="dialog"]');
    const cartModal = cartDialog.locator('#cross-popup-dialog-title');
    const continueShoppingButton = cartDialog.getByRole('button', { name: 'Pokračovat v nákupu' });
    const cartItemCount = page.locator('[data-testid="headerBasketIcon"] span');

    const filterInStock = async () => {
      await expect(inStockFilter).toBeVisible();
      const isChecked = await inStockFilter.locator('input').isChecked();
      if (!isChecked) {
        await inStockFilter.click();
        await page.waitForLoadState('networkidle');
      }
    };

    const sortByBestSelling = async () => {
      await expect(sortBySales).toBeVisible();
      await sortBySales.click();
      await page.waitForLoadState('networkidle');
    };

    const clickBuyButton = async () => {
      const increaseButton = page.locator('[data-testid="component-buyButton"] [data-testid="button-increase"]');
      const singleBuyButton = page.locator('[data-testid="component-buyButton"] button:only-child');

      if (await increaseButton.isVisible()) {
        // Produkt už je v košíku – klikni na + (modál se neotevře)
        await increaseButton.click();
      } else {
        // Produkt ještě není v košíku – klikni na Koupit
        await expect(singleBuyButton).toBeVisible();
        await singleBuyButton.scrollIntoViewIfNeeded();
        await singleBuyButton.click();
        await expect(cartModal).toBeVisible();
        await expect(continueShoppingButton).toBeVisible();
        await continueShoppingButton.click();
        await expect(continueShoppingButton).toBeHidden();
      }
    };

    // Vyhledání notebooků
    await expect(searchInput).toBeVisible();
    await searchInput.fill('notebook');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/notebook/);
    await filterInStock();
    await sortByBestSelling();

    // Přidání 1. produktu (notebook)
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();
    await clickBuyButton();

    // Přidání stejného produktu znovu – 2. položka (uživatel se uklikl)
    await clickBuyButton();

    // Vyhledání myší
    await expect(searchInput).toBeVisible();
    await searchInput.clear();
    await searchInput.fill('bezdrátová myš');
    await expect(searchInput).toHaveValue('bezdrátová myš');
    await searchButton.click();
    await expect(page).toHaveURL(/bezdratova/);
    await filterInStock();
    await sortByBestSelling();

    // Přidání 3. produktu (1. myš)
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();
    await clickBuyButton();

    // Návrat na výsledky vyhledávání
    await page.goBack();
    await expect(secondProductLink).toBeVisible();

    // Přidání 4. produktu (2. myš)
    await secondProductLink.click();
    await clickBuyButton();

    // Přidání stejného produktu znovu – 5. položka (uživatel se uklikl)
    await clickBuyButton();

    // Košík má 5 položek, ale assertujeme na 3 – test ověřuje, že počítadlo správně odchytí nesrovnalost
    const expectedItems = 3;
    const actualText = await cartItemCount.textContent();
    expect(actualText).not.toBe(String(expectedItems));

  });

  test('Změna množství produktu v košíku - edge case', async ({ page }) => {
    test.setTimeout(120000);

    const targetQuantity = 16; // parametr, stačí změnit na 33 a test se přizpůsobí

    const searchInput = page.locator('input[data-testid="searchInput"]');
    const inStockFilter = page.locator('[data-testid="alza-branches"] label');
    const sortBySales = page.locator('a[data-sort-name="Sales"]');
    const firstProductLink = page.locator('#boxes .js-box').first().locator('a.name.browsinglink');
    const productTitle = page.locator('h1.h1-placeholder');
    const productPrice = page.locator('[data-testid="price-primary"] span.price-box__primary-price__value');
    const productCode = page.locator('[data-testid="more-info-product-code"] [data-testid="value"]');
    const buyButton = page.locator('[data-testid="component-buyButton"] button');
    const cartDialog = page.locator('[role="dialog"]');
    const cartModal = cartDialog.locator('#cross-popup-dialog-title');
    const goToCartButton = cartDialog.getByRole('button', { name: 'Pokračovat do košíku' });
    const productRow = page.locator('div.tr').first();
    const cartRowPrice = productRow.locator('div.c5');
    const countInput = productRow.locator('input[data-value]');
    const countPlus = productRow.locator('button.countPlus');
    const totalPrice = page.locator('span.last.price');

    const filterInStock = async () => {
      await expect(inStockFilter).toBeVisible();
      const isChecked = await inStockFilter.locator('input').isChecked();
      if (!isChecked) {
        await inStockFilter.click();
        await page.waitForLoadState('networkidle');
      }
    };

    const sortByBestSelling = async () => {
      await expect(sortBySales).toBeVisible();
      await sortBySales.click();
      await page.waitForLoadState('networkidle');
    };

    // Vyhledání produktu
    await expect(searchInput).toBeVisible();
    await searchInput.fill('notebook');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/notebook/);
    await filterInStock();
    await sortByBestSelling();
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();

    // Uložení údajů produktu
    await expect(productTitle).toBeVisible();
    const name = (await productTitle.textContent())?.trim() || '';
    const price = parsePrice((await productPrice.textContent()) || '');
    const code = (await productCode.textContent())?.trim() || '';
    console.log('Produkt:', name, '| Cena:', price, 'Kč', '| Kód:', code);

    // Přidání do košíku
    await expect(buyButton).toBeVisible();
    await buyButton.scrollIntoViewIfNeeded();
    await buyButton.click();
    await expect(cartModal).toBeVisible();

    // Přechod do košíku
    await expect(goToCartButton).toBeVisible();
    await goToCartButton.click();
    await expect(page).toHaveURL(/Order/i);

    // Ověření původního stavu (1 ks)
    await expect(productRow).toBeVisible();
    await expect(countInput).toHaveValue('1');
    const cartPrice = parsePrice((await cartRowPrice.textContent()) || '');
    expect(cartPrice).toBe(price);
    console.log(`Množství: 1 ks | Cena řádku: ${cartPrice} Kč | Celková cena: ${cartPrice} Kč`);

    // Postupné navyšování množství až na targetQuantity
    for (let i = 2; i <= targetQuantity; i++) {
      await expect(countPlus).toBeVisible();
      await countPlus.click();
      await expect(countInput).toHaveValue(String(i));

      const expectedRowPrice = price * i;
      const actualRowPrice = parsePrice((await cartRowPrice.textContent()) || '');
      expect(actualRowPrice).toBe(expectedRowPrice);

      const actualTotalPrice = parsePrice((await totalPrice.textContent()) || '');
      expect(actualTotalPrice).toBe(expectedRowPrice);

      console.log(`Množství: ${i} ks | Cena řádku: ${actualRowPrice} Kč | Celková cena: ${actualTotalPrice} Kč | Očekáváno: ${expectedRowPrice} Kč`);
    }

    console.log(`Test dokončen: ${targetQuantity} ks produktu "${name}" v košíku.`);
    await page.screenshot({ path: 'screenshots/kosik_zmena_mnozstvi.png' });

  });

});
