class KycPage {
  constructor(page) {
    this.page = page;

    this.startBtn = page.getByRole('button', { name: 'התחל רישום' });
    this.nextBtn = page.getByRole('button', { name: 'המשך לשלב הבא' });
    this.startVerificationBtn = page.getByRole('button', { name: 'התחל אימות' });

    this.bankNumber = this.getInput('מספר בנק');
    this.branchNumber = this.getInput('מספר סניף');
    this.accountNumber = this.getInput('מספר חשבון בנק');

    this.city = this.getInput('עיר');
    this.zip = this.getInput('מיקוד');

    this.checkboxTerms = page.getByRole('checkbox', { name: /תנאי השימוש/i });
  
  }

  getInput(label) {
    return this.page.getByText(label).locator('..').locator('input');
  }

  async startRegistration() {
    await this.startBtn.click();
  }

  async validateAddress() {
     const jsonPath = path.resolve(__dirname, '../data/kycData.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    await expect(this.city).toHaveValue(data.city);
    await expect(this.zip).toHaveValue(data.zip);
  }

  async validateBankDetails() {
    const jsonPath = path.resolve(__dirname, '../data/kycData.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    await expect(this.bankNumber).toHaveValue(data.bankNumber);
    await expect(this.branchNumber).toHaveValue(data.branchNumber);
    await expect(this.accountNumber).not.toBeEmpty(data.accountNumber);
  }

  async validateCheckbox() {
    await expect(this.checkboxTerms).toBeChecked();
  }

  async continue() {
    await this.nextBtn.click();
  }

  async startVerification() {
    await this.startVerificationBtn.click();
  }
}

module.exports = { KycPage };