const { expect } = require('@playwright/test');

class cheshboniotPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://dashboard.upcapital.io/crafted/widgets/tables');
    // אם המערכת זורקת אותנו ללוגין
    if (this.page.url().includes('/auth')) {
      await this.login('0527116967', '240220261');
    }

    await expect(this.page).toHaveURL(/Suppliers/, { timeout: 15000 });
    await this.page.waitForSelector('table', { state: 'visible' });
    console.log('הגענו לעמוד הספקים בהצלחה!');
  }}
  module.exports = { cheshboniotPage };