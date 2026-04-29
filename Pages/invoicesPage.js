const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

class InvoicesPage {
  constructor(page) {
    this.page = page;
     // this.menuButton = this.page.getByTestId('invoices-menu');
  }
async getInvoiceData() {
    const filePath = path.resolve(__dirname, '../data/invoiceData.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  async writeToExell(filePath) {

    const data = await this.getInvoiceData();

    // טוענים את האקסל
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];

    // מיפוי מסודר (לא Object.values!)
    const cellsMap = [
      data.invoiceNumber,
      data.supplierId,
      data.orderId,
      data.startDate,
      data.endDate,
      data.amount
    ];

    const cells = ['A2','B2','C2','D2','E2','F2'];

    cells.forEach((cell, i) => {
      ws[cell] = { t: 's', v: cellsMap[i] };
    });

    XLSX.writeFile(wb, filePath);
  }
async goto() {
  
    await this.page.goto(process.env.INVOICE_URL);

    // אם המערכת זורקת אותנו ללוגין
    if (this.page.url().includes('/auth')) {
       const phone = process.env.USER_PHONE;
       const password = process.env.USER_PASS;
       await this.login(phone, password);
    }

    await expect(this.page).toHaveURL(/tables/, { timeout: 15000 });
    await this.page.waitForSelector('table', { state: 'visible' });
    console.log('הגענו לעמוד החשבוניות בהצלחה!');
}
async open() {
  await this.page
  .locator('button[data-kt-menu-trigger="click"]')
  .filter({ has: this.page.locator('i.fa-ellipsis-vertical') })
  .click();
}

  async uploadExcel(filePath) {
    if (!filePath) throw new Error("Missing filePath for upload");

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.page.getByText('חשבונית מקובץ Excel').click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(filePath);
    console.log('הקובץ נבחר במערכת');

    // לווקטור גמיש לכפתור האישור הסופי
    const uploadButton = this.page.locator('button:has-text("Upload Excel"), button:has-text("אישור")').last();
    
    await uploadButton.scrollIntoViewIfNeeded(); 
    await uploadButton.click();

   await this.page.waitForLoadState('networkidle');
    console.log('תוכן הקובץ הועלה לטבלה');
  }
async downloadExcel() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.getByText('הורדת Excel').click();
    const download = await downloadPromise;

    // יצירת נתיב מוחלט
    const filePath = path.resolve(__dirname, '../downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    
    console.log(`קובץ ירד בהצלחה לכתובת: ${filePath}`);
    return filePath;
  
  }
 async approveInvoice() {
  //const firstRow = this.page.getByRole('row').first();
  // await firstRow.locator('input[type="checkbox"]').check();
  //await this.page.getByRole('checkbox').first().check(); 
    const supplierRow = this.page.locator('tr', { hasText: 'c2343234568' });

const checkbox = supplierRow.locator('input[type="checkbox"]');

if (!(await checkbox.isChecked())) {
  await checkbox.click();
}
  await this.page.getByRole('link', { name: 'אישור' }).click();
  console.log('לחצתי על אישור חשבונית');
 }
}
module.exports = { InvoicesPage };

  


