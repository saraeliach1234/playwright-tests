class QuickMenu {

  constructor(page) {
    this.page = page
  //  this.menuButton = page.locator('button[data-kt-menu-trigger="click"]');
     // המתן שהכפתור יהיה זמין וגלוי לפני גישה אליו
    //this.page.waitForSelector('div:has(button[title="Help"]) > button', { state: 'visible' });
   //this.menuButton = this.page.locator('div:has(button[title="Help"]) > button').first();
   //this.menuButton = this.page.locator('button[data-kt-menu-trigger="click"]').first();
      // this.menuButton = page.locator('button:has(i.fa-ellipsis-vertical)').first();
       // this.menuButton = this.page.locator('button:has-text("")');
       this.menuButton = this.page
  .locator('button[title="Help"]')
  .locator('xpath=preceding-sibling::button');
   }

  

async open() {
  await this.menuButton.waitFor({ state: 'visible' });

  await this.menuButton.scrollIntoViewIfNeeded();

  await this.menuButton.click();

  
  console.log('xcvהתפריט נפתח!');
 
}
/*async open() {
  await this.menuButton.waitFor({ state: 'visible' });

  await this.menuButton.click();

  // מחכים שהתפריט באמת יהיה פתוח (לא רק קיים)
  const menu = this.page.locator('.menu.show');

  await expect(menu).toBeVisible({ timeout: 10000 });

  console.log('התפריט נפתח באמת');
}*/


}

module.exports = { QuickMenu };
