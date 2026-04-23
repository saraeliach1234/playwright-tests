
class LoginPage {

  constructor(page) {
    this.page = page
    this.phoneInput = page.locator('input[type="tel"]')
    this.idInput = page.locator('input[type="text"]')
    this.continueBtn = page.getByRole('button', { name: 'המשך' })
  }

  async setupOtpHandler() {

    let otpCode = ''

    this.page.on('dialog', async dialog => {

      if (dialog.type() === 'alert') {
        otpCode = dialog.message()
        console.log(`הקוד שחולץ: ${otpCode}`)
        await dialog.accept()
      }

      else if (dialog.type() === 'prompt') {
        console.log('מזין את הקוד לפופאפ הטוקן')
        await dialog.accept(otpCode)
      }

    })

  }

  async goto() {
    await this.page.goto(process.env.BASE_URL)
  
   await this.page.getByRole('textbox').first().waitFor();
  }

 async login(phone,password) 
 {
  
  await this.page.goto(process.env.BASE_URL);

  await this.phoneInput.fill(phone);
  
  await this.idInput.fill(password);

  // מחכים שהכפתור יהיה גלוי
  await this.continueBtn.waitFor({ state: 'visible' });

  // מוודאים שהוא enabled לפני לחיצה
  if (!(await this.continueBtn.isEnabled())) {
    throw new Error('כפתור "המשך" אינו פעיל');
  }

  // לוחצים על הכפתור
  await this.continueBtn.click();

  // מחכים לנווט לדשבורד
  await this.page.waitForURL('**/dashboard', { timeout: 60000 });
}
  
}

module.exports = { LoginPage }