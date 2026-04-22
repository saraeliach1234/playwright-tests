class QuickMenu2 {

  constructor(page) {
    this.page = page
     // המתן שהכפתור יהיה זמין וגלוי לפני גישה אליו
    //this.page.waitForSelector('div:has(button[title="Help"]) > button', { state: 'visible' });
    this.menuButton = page.locator('div:has(button[title="Help"]) > button').first();
   }

  async open() {

    await this.menuButton.click()

   await this.page.waitForSelector('text=פעולות מהירות', { state: 'visible', timeout: 10000 }) // 10 שניות timeout

    console.log('התפריט נפתח!')

  }

}

module.exports = { QuickMenu2 };