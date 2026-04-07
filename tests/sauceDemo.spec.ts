import { test, expect } from '@playwright/test';

//test s Xpath lokátory//

test.describe('SauceDemo-Xpath', () => {

  test('login flow', async ({ page }) => {
    const baseUrl = 'https://www.saucedemo.com/';

    // elementy od rodiče k potomkům
    const rootContainer = page.locator('xpath=//body/div[@id="root"]');
    const loginContainer = rootContainer.locator('xpath=//div[@data-test="login-container"]');
    const loginForm = loginContainer.locator('xpath=//form');

    // elementy uvnitř formuláře 
    const buttonLogin = loginForm.locator('xpath=//input[@data-test="login-button"]');
    const fieldUsername = loginForm.locator('xpath=//input[@data-test="username"]');
    const fieldPassword = loginForm.locator('xpath=//input[@data-test="password"]');
    const errorMessage = loginForm.locator('xpath=//h3[@data-test="error"]');

    // elementy na stránce s produkty 
    const pageTitle = page.locator('xpath=//span[@data-test="title"]');
    const burgerMenu = page.locator('xpath=//button[@id="react-burger-menu-btn"]');
    const logoutLink = page.locator('xpath=//a[@id="logout_sidebar_link"]');

    // #1a)
    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
    await expect(loginForm).toBeVisible();
    await loginForm.screenshot({ path: 'screenshots/01_login_form.png' });

    // #1b)
    await expect(buttonLogin).toBeVisible();
    await buttonLogin.click();

    // #1c)
    await expect(errorMessage).toContainText('Username is required');
    await page.screenshot({ path: 'screenshots/02_missing_username.png' });

    // #1d)
    await expect(fieldUsername).toBeVisible();
    await fieldUsername.fill('standard_user');
    await buttonLogin.click();

    // #1e)
    await expect(errorMessage).toContainText('Password is required');
    await page.screenshot({ path: 'screenshots/03_missing_password.png' });

    // #1f)
    await expect(fieldPassword).toBeVisible();
    await fieldPassword.fill('secret_sauce');
    await buttonLogin.click();

    // #1g)
    await expect(loginForm).not.toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toContainText('Products');

    // #1h)
    await page.screenshot({ path: 'screenshots/04_products_page.png' });

    // #1i)
    await expect(burgerMenu).toBeVisible();
    await burgerMenu.click();
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();

    // #1j)
    await expect(pageTitle).not.toBeVisible();
    await expect(loginForm).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

  });

});

//test s CSS lokátory//

test.describe('SauceDemo-CSS', () => {

  test('login flow', async ({ page }) => {
    const baseUrl = 'https://www.saucedemo.com/';
    const loginForm = page.locator('div.login-box form');

    // elementy uvnitř formuláře 
    const buttonLogin = loginForm.locator('[data-test="login-button"]');
    const fieldUsername = loginForm.locator('[data-test="username"]');
    const fieldPassword = loginForm.locator('[data-test="password"]');
    const errorMessage = loginForm.locator('[data-test="error"]');

    // elementy na stránce s produkty 
    const pageTitle = page.locator('[data-test="title"]');
    const burgerMenu = page.locator('#react-burger-menu-btn');
    const logoutLink = page.locator('#logout_sidebar_link');

    // #1a)
    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
    await expect(loginForm).toBeVisible();
    await loginForm.screenshot({ path: 'screenshots/01_login_form.png' });

    // #1b)
    await expect(buttonLogin).toBeVisible();
    await buttonLogin.click();

    // #1c)
    await expect(errorMessage).toContainText('Username is required');
    await page.screenshot({ path: 'screenshots/02_missing_username.png' });

    // #1d)
    await expect(fieldUsername).toBeVisible();
    await fieldUsername.fill('standard_user');
    await buttonLogin.click();

    // #1e)
    await expect(errorMessage).toContainText('Password is required');
    await page.screenshot({ path: 'screenshots/03_missing_password.png' });

    // #1f)
    await expect(fieldPassword).toBeVisible();
    await fieldPassword.fill('secret_sauce');
    await buttonLogin.click();

    // #1g)
    await expect(loginForm).not.toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toContainText('Products');

    // #1h)
    await page.screenshot({ path: 'screenshots/04_products_page.png' });

    // #1i)
    await expect(burgerMenu).toBeVisible();
    await burgerMenu.click();
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();

    // #1j)
    await expect(pageTitle).not.toBeVisible();
    await expect(loginForm).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

  });

});

// konec