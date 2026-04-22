const { expect } = require('@playwright/test');

class InvoicesPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://dashboard.upcapital.io/crafted/widgets/tables');
    // אם המערכת זורקת אותנו ללוגין
    if (this.page.url().includes('/auth')) {
      await this.login('0527116967', '240220261');
    }

  // המתן עד שהדף יטען ושהטבלה תהיה גלויה
    await expect(this.page).toHaveURL(/tables/, { timeout: 15000 });
    await this.page.waitForLoadState('load');  // ודא שהדף נטען במלואו
    await this.page.waitForSelector('table', { state: 'visible', timeout: 60000 });  // זמן המתנה מוגדל אם צריך

    console.log('הגענו לעמוד החשבוניות בהצלחה!');

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
}
  module.exports = { InvoicesPage };
  