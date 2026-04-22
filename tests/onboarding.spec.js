const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { SuppliersPage } = require('../pages/suppliersPage');
const fs = require('fs');
const path = require('path');


test('onboarding test 1 flow', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
 await loginPage.setupOtpHandler();
  await loginPage.goto();
  await loginPage.login('+972 52 711 6967', '240220262');


  await expect(page).toHaveURL(/dashboard/);

  const continueButton = page.locator('[data-test-id="kyc-missing-continue"]');

await expect(continueButton).toBeVisible();
await continueButton.click();

const startButton = page.getByRole('button', { name: 'התחל רישום' });

await startButton.waitFor({ state: 'visible' });
await startButton.click();
const data = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../data/onboardingData.json'),
    'utf-8'
  )
);
await expect(page.getByText('שם ספק').locator('..').locator('input'))
  .toHaveValue(data.supplierName);//ח.פ ספק
await expect(page.getByText('ח.פ ספק').locator('..').locator('input')).toHaveValue(data.supplierId);

await expect(page.getByText('כתובת רחוב')
  .locator('..')
  .locator('input')
).toHaveValue(data.street);

await expect(page.getByText('עיר').locator('..').locator('input')).toHaveValue(data.city);
await expect(page.getByText('מיקוד').locator('..').locator('input')).toHaveValue(data.zip);
//מספר בנק
await expect(page.getByText('מספר בנק').locator('..').locator('input')).toHaveValue(data.bankNumber);
await expect(page.getByText('מספר סניף').locator('..').locator('input')).toHaveValue(data.branchNumber);
//await expect(page.getByText('מספר חשבון בנק').locator('..').locator('input')).toHaveValue('333444');
await expect(
  page.getByText('מספר חשבון בנק')
    .locator('..')
    .locator('input')
).toHaveValue(/\d{6,}/);
//פרטי איש קשר
await expect(page.getByText('שם פרטי איש קשר').locator('..').locator('input')).toHaveValue(data.contactFirstName);
await expect(page.getByText('שם משפחה איש קשר').locator('..').locator('input')).toHaveValue(data.contactLastName);
await expect(page.getByText('טלפון איש קשר').locator('..').locator('input')).toHaveValue(data.contactPhone);
await expect(page.getByText('אימייל איש קשר').locator('..').locator('input')).toHaveValue(data.contactEmail);
await expect(
  page.locator('input[type="checkbox"]').first()
).toBeChecked();
await page.getByRole('button', { name: 'המשך לשלב הבא' }).click();
await page.getByRole('button', { name: 'התחל אימות' }).click();
await page.getByRole('button', { name: 'המשך' }).click();
//await page.getByRole('button', { name: 'המשך' }).click();

   await page.pause(); // מצוין לניטור התוצאות בסיום

});




