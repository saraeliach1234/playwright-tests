const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { SuppliersPage } = require('../pages/suppliersPage');

/*test.use({
  ...devices['iPhone SE']
});*/

test('Admin Full Flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
// const quickMenu = new QuickMenu(page);
  const suppliersPage = new SuppliersPage(page);
  // הגדרת ה-OTP לפני תחילת הלוגין
  await loginPage.setupOtpHandler();
  await loginPage.goto();
  await loginPage.login('+972 533383602', 'upcapital_admin');

  // ניווט לעמוד הספקים
 await suppliersPage.goto();
 
  
const button = page.getByText('Select customer');
await button.waitFor({ state: 'visible', timeout: 5000 });
await button.click();

// בחירה לפי ה-Value הייחודי
await page.locator('select.form-control').selectOption('6f5ed609-4d82-4310-baa1-2e316e578da1');

// איתור מדויק של הקישור בתוך השורה כדי למנוע את השגיאה על 4 אלמנטים
await page.locator('tr', { hasText: '190420263' })
          .getByText('190420263')
          .click();

const tab = page.getByRole('link', { name: 'סטטוס אישור upcapital' });
await tab.waitFor({ state: 'visible' });
await tab.click();

await page.locator('label').filter({ hasText: 'Yes' }).click();


const submitButton = page.getByText('submit');
await submitButton.waitFor({ state: 'visible', timeout: 5000 });
await submitButton.click();

const tab2 = page.getByRole('link', { name: 'אנשי קשר' });
await tab2.waitFor({ state: 'visible' });
await tab2.click();

await page.locator('input.widget-13-check').check();

const okButton = page.getByText('אישור KYC');
await okButton.waitFor({ state: 'visible', timeout: 5000 });
await okButton.click();

await page.locator('.fa-arrow-left').click();

 //await page.pause(); // מצוין לניטור התוצאות בסיום
});
test('Approve supplier test 2', async ({ page }) => {
  const loginPage = new LoginPage(page);
    const suppliersPage = new SuppliersPage(page);
  
 await loginPage.setupOtpHandler();
  await loginPage.goto();
  await loginPage.login('+972 52 711 6967', '240220261');

await suppliersPage.goto();
await suppliersPage.approveSupplierForOnboarding();

  
});

