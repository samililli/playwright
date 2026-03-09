import { test, expect } from '@playwright/test';

test.describe('commitQuality crud', () => {

  test('commitQuality flow', async ({ page }) => {
    const baseUrl = 'https://commitquality.com';
    const navbarProducts = page.locator('//nav[@class="navbar"]//a[@data-testid="navbar-products"]');
    const navbarLogin = page.locator('//nav[@class="navbar"]//a[@data-testid="navbar-login"]');
    const navbarLogout = page.locator('//nav[@class="navbar"]//a[@data-testid="navbar-logout"]');
    const navbarAddProduct = page.locator('//nav[@class="navbar"]//a[@data-testid="navbar-addproduct"]');
    const usernameField = page.locator('//form//input[@data-testid="username-textbox"]');
    const passwordField = page.locator('//form//input[@data-testid="password-textbox"]');
    const loginButton = page.locator('//form//button[@data-testid="login-button"]');
    const productNameField = page.locator('//form//input[@data-testid="product-textbox"]');
    const productPriceField = page.locator('//form//input[@data-testid="price-textbox"]');
    const productDateField = page.locator('//form//input[@data-testid="date-stocked"]');
    const submitButton = page.locator('//form//button[@data-testid="submit-form"]');
    const filterField = page.locator('//div[@class="filter-container"]//input[@placeholder="Filter by product name"]');
    const filterButton = page.locator('//div[@class="filter-container"]//button[@data-testid="filter-button"]');
    const filteredProductRow = page.locator('//tbody//tr[1]');
    const editButton = page.locator('//tbody//tr[1]//a[@data-testid="edit-button"]');
    const deleteButton = page.locator('//tbody//tr[1]//a[@data-testid="delete-button"]');
    const initialDate = '2025-01-15';
    const editedDate = '2024-06-20';
    const noProductsMessage = page.locator('//p[@class="add-product-message"]');

    // #1a) Otevření stránky CommitQuality. 
    await page.goto(baseUrl);
    await expect(navbarProducts).toBeVisible();
    await expect(page).toHaveURL(baseUrl);

    // #1b) Přihlášení pomocí odkazu Login v menu.
    await expect(navbarLogin).toBeVisible();
    await navbarLogin.click();
    await expect(page).toHaveURL(`${baseUrl}/login`);
    await expect(usernameField).toBeVisible();
    await usernameField.fill('test');
    await expect(passwordField).toBeVisible();
    await passwordField.fill('test');
    await loginButton.click();
    await expect(navbarLogin).not.toBeVisible();
    await expect(navbarLogout).toBeVisible();

    // #1c) Otevření stránky Add Product a vytvoření nového produktu. 
      // Definování náhodných dat pro nový produkt
    const randomName = `Product ${Math.floor(Math.random() * 100) + 1}`;
    const randomPrice = String(Math.floor(Math.random() * 900) + 100); 
    
    await expect(navbarAddProduct).toBeVisible();
    await navbarAddProduct.click();
    await expect(page).toHaveURL(`${baseUrl}/add-product`);
    await expect(productNameField).toBeVisible();
    await productNameField.fill(randomName);
    await expect(productPriceField).toBeVisible();
    await productPriceField.fill(randomPrice);
    await expect(productDateField).toBeVisible();
    await productDateField.fill('2025-01-15');
    await submitButton.click();
    await expect(filterField).toBeVisible();

    // #1d) Vyhledání nově vytvořeného produktu pomocí filtru v horní části stránky.
    await expect(page).toHaveURL(baseUrl);
    await expect(filterField).toBeVisible();
    await filterField.fill(randomName);
    await filterButton.click();

    // #1e) Ověřit údaje našeho vyhledaného produktu.
    await expect(filteredProductRow.getByTestId('name')).toHaveText(randomName);
    await expect(filteredProductRow.getByTestId('price')).toHaveText(randomPrice);
    await expect(filteredProductRow.getByTestId('dateStocked')).toHaveText(initialDate);

    // #1f) Editace nově vytvořeného produktu – změna všech jeho údajů.
      // Definování náhodných dat pro nový produkt
    const editedName = `Product ${Math.floor(Math.random() * 100) + 1}`;
    const editedPrice = String(Math.floor(Math.random() * 900) + 100);

    await expect(editButton).toBeVisible();
    await editButton.click();
    await expect(productNameField).toBeVisible();
    await productNameField.clear();
    await productNameField.fill(editedName);
    await productPriceField.clear();
    await productPriceField.fill(editedPrice);
    await productDateField.fill('2024-06-20');
    await submitButton.click();
    await expect(filterField).toBeVisible();

    // #1g) Po úspěšné změně ověření, že se vše změnilo dle našeho zadání.
    await expect(page).toHaveURL(baseUrl);
    await expect(filterField).toBeVisible();
    await filterField.fill(editedName);
    await filterButton.click();
    await expect(filteredProductRow.locator('//td[@data-testid="name"]')).toHaveText(editedName);
    await expect(filteredProductRow.locator('//td[@data-testid="price"]')).toHaveText(editedPrice);
    await expect(filteredProductRow.getByTestId('dateStocked')).toHaveText(editedDate);

    // #1h) Smazání tohoto produktu + ověření, že je opravdu smazaný. 
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    await expect(page.locator(`//tbody//td[@data-testid="name"][text()="${editedName}"]`)).not.toBeVisible();
    await filterField.fill(editedName);
    await filterButton.click();
    await expect(noProductsMessage).toBeVisible();

    // #1i) Odhlášení pomocí odkazu Logout v menu. 
    await expect(navbarLogout).toBeVisible();
    await navbarLogout.click();

    // #1j) Ověření, že je uživatel odhlášený. 
    await expect(navbarLogout).toBeHidden();
    await expect(navbarLogin).toBeVisible();

  });

});
