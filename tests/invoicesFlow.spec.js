const { test, expect } = require('@playwright/test');
//, devices
const { LoginPage } = require('../pages/loginPage');
const { QuickMenu } = require('../pages/quickMenu');
//const { SuppliersPage } = require('../pages/suppliersPage');
const { InvoicesPage } = require('../pages/invoicesPage');
/*test.use({
  ...devices['iPhone SE']
});*/

test('Invoices Full Flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
 const quickMenu = new QuickMenu(page);
  //const suppliersPage = new SuppliersPage(page);
  const invoicesPage =new InvoicesPage(page);
  // הגדרת ה-OTP לפני תחילת הלוגין
  await loginPage.setupOtpHandler();
  await loginPage.goto();
  const phone = process.env.USER_PHONE;
  const password = process.env.USER_PASS;
  await loginPage.login(phone, password);

await invoicesPage.goto();
await page.waitForLoadState('networkidle'); // מחכה שכל הבקשות יסתיימו
await invoicesPage.open();
 const filePath = await invoicesPage.downloadExcel();
await invoicesPage.writeToExell(filePath);
await invoicesPage.open();
await invoicesPage.uploadExcel(filePath);
await invoicesPage.approveInvoice();
await page.pause(); // מצוין לניטור התוצאות בסיום


});