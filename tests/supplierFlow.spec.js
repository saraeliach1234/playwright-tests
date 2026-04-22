const { test, expect } = require('@playwright/test');
//, devices
const { LoginPage } = require('../pages/loginPage');
const { QuickMenu } = require('../pages/quickMenu');
const { SuppliersPage } = require('../pages/suppliersPage');

/*test.use({
  ...devices['iPhone SE']
});*/

test('Supplier Full Flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
 const quickMenu = new QuickMenu(page);
  const suppliersPage = new SuppliersPage(page);
  // הגדרת ה-OTP לפני תחילת הלוגין
  await loginPage.setupOtpHandler();
  await loginPage.goto();
  const phone = process.env.USER_PHONE;
  const password = process.env.USER_PASS;
//console.log('PASS:', password);
      await loginPage.login(phone,password);

  // ניווט לעמוד הספקים
 await suppliersPage.goto();
 
  // הורדת האקסל ושמירת הנתיב שלו
  await quickMenu.open();
 const filePath= await suppliersPage.downloadExcel();
  
  await suppliersPage.wrightToExell(filePath);
//const pathForUpload = 'C:/Users/User/tests/downloads/suppliers1.xlsx'
  // העלאת האקסל שזה עתה הורד
const path = require('path');

const newFilePath = path.resolve(
  __dirname,
  '../uploads/suppliers.xlsx'


);

await quickMenu.open();
await suppliersPage.uploadExcel(filePath);
 

  // יצירת ספק ופעולות אישור/דחייה
 /*await quickMenu.open();
  await suppliersPage.createSupplier();*/

  // פעולות על הטבלה (כאן כנראה לא צריך quickMenu כי הטבלה כבר גלויה)
  await suppliersPage.approveSupplier();
 // await suppliersPage.rejectSupplier();

   await page.pause(); // מצוין לניטור התוצאות בסיום
});