const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');


class SuppliersPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(process.env.SUPPLIERS_URL);

    // אם המערכת זורקת אותנו ללוגין
    if (this.page.url().includes('/auth')) {
       
      await this.login(phoprocess.env.USER_PHONE, process.env.USER_PASS);
    }

    await expect(this.page).toHaveURL(/Suppliers/, { timeout: 15000 });
    await this.page.waitForSelector('table', { state: 'visible' });
    console.log('הגענו לעמוד הספקים בהצלחה!');
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
 
async getSupplierData() {
    const filePath = path.resolve(__dirname, '../data/supplier.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    
  }

async writeToExell(filePath) {
  const suppliersData = await this.getSupplierData();

  const suppliers = Array.isArray(suppliersData)
    ? suppliersData
    : suppliersData.suppliers || [suppliersData];

  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];

  const startRow = 2;

  suppliers.forEach((supplier, index) => {
    const row = startRow + index;

    const rowData = [
      supplier.Name,
      supplier.WHT_Identifier,
      supplier.WHT_DeductionPercent,
      supplier.WHT_DeductionDate,
      supplier.Contact_FirstName,
      supplier.Contact_LastName,
      supplier.Contact_PhoneNumber,
      supplier.Contact_Email,
      supplier.Bank_Name,
      supplier.Bank_AccountNumber,
      supplier.Bank_BranchNumber
    ];

    const columns = ['A','B','C','D','E','F','G','H','I','J','K'];

    columns.forEach((col, i) => {
      const value = rowData[i];

      ws[`${col}${row}`] = {
        t: typeof value === 'number' ? 'n' : 's',
        v: value ?? ''
      };
    });
  });

  XLSX.writeFile(wb, filePath);
return suppliers.map(s => s.Name);
  }

  
 
  async uploadExcel(filePath) {
    if (!filePath) throw new Error("Missing filePath for upload");

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.page.getByText('ספקים מקובץ Excel').click();
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

  /*async createSupplier() {
    const jsonPath = path.resolve(__dirname, '../data/supplierData.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    await this.page.getByText('CREATE.SUPPLIER').click();
    await this.page.getByPlaceholder('Enter supplier Company Name').fill('חברה חדשה טסט בע"מ');
    await this.page.getByPlaceholder('Enter Company ID').fill('511223344');
    await this.page.locator('#WHT_DeductionPercent').fill('0');
    await this.page.locator('#WHT_DeductionDate').fill('2026-12-31');
    await this.page.getByRole('button', { name: 'Next' }).click();
    console.log('ספק חדש נוצר');
  }*/

  async approveSupplier(myData) {
    console.log(myData);
    const supplierRow = this.page.locator('tr', { hasText:myData });
    await supplierRow.locator('input[type="checkbox"]').check();
    await this.page.getByRole('link', { name: 'אישור' }).click();
    console.log('לחצתי על אישור ספק');
  }

 /* async rejectSupplier() {
    const supplierRow = this.page.locator('tr', { hasText: 'טסט' }).first();
    await supplierRow.locator('input[type="checkbox"]').check();
    await this.page.getByRole('link', { name: 'דחה' }).click();
    console.log('לחצתי על דחיית ספק');
  }*/
}

module.exports = { SuppliersPage };