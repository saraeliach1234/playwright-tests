const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { SuppliersPage } = require('../pages/suppliersPage');
const fs = require('fs');
const path = require('path');
async function handleDynamicField(page, label, value) {
  if (!value) return;

  const field = page.getByText(label)
    .locator('..')
    .locator('input, textarea, select');

  await field.waitFor({ state: 'visible' });

  const currentValue = await field.inputValue().catch(() => '');

  if (!currentValue) {
    await field.fill(String(value));
  }
}
async function selectCheckboxesAndContinue(page) {
  const dialog = page.getByRole('dialog');

  // מחכים לדיאלוג באמת
  await dialog.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
    return; // אם אין דיאלוג בכלל
  });

  if (!(await dialog.isVisible().catch(() => false))) return;

  const checkboxes = dialog.locator('input[type="checkbox"]');
  const count = await checkboxes.count();

  for (let i = 0; i < count; i++) {
    await checkboxes.nth(i).check({ force: true });
  }

  const continueBtn = dialog.getByRole('button', { name: /אני מאשר|ממשיך|המשך/i });

  if (!(await continueBtn.isVisible().catch(() => false))) {
    return;
  }

  await continueBtn.click();

  await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
}
async function goNextStep(page) {
  const continueButton = page.getByRole('button', {
    name: /המשך|התחל רישום|אני מאשר/i
  });

  try {
    await continueButton.waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    console.log('כפתור המשך לא קיים בשלב הזה – מדלג');
    return;
  }

  await continueButton.click();
}

async function fillForm(page, label, value) {
  const container = page.getByText(label).locator('..');

  const input = container.locator('input:visible');

  await input.fill(String(value));
}
function toDateInputFormat(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}
test('onboarding test 1 flow', async ({ page }) => {
  const data = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../data/supplierDataForonboarding.json'),
    'utf-8'
  )
);

  const loginPage = new LoginPage(page);
 const phone = process.env.USER_PHONE;
  const password =data.WHT_Identifier;
  await loginPage.goto();
 await loginPage.setupOtpHandler();
  await loginPage.goto();
  await loginPage.login(phone, password);


  await expect(page).toHaveURL(/dashboard/);
await selectCheckboxesAndContinue(page);
 await goNextStep(page);


/*const data = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../data/onboardingData.json'),
    'utf-8'
  )
);*/

await handleDynamicField(page, 'שם ספק', data.Name);
await handleDynamicField(page, 'ח.פ ספק', data.WHT_Identifier);
await handleDynamicField(page, 'כתובת רחוב', data.vendor_street);
await handleDynamicField(page, 'עיר', data.vendor_city);
await handleDynamicField(page, 'מיקוד', data.vendor_zip);
await handleDynamicField(page, 'מספר בנק', data.bankName);
await handleDynamicField(page, 'מספר חשבון', data.bankAccountNumber);
await handleDynamicField(page, 'מספר סניף', data.bankBranchNumber);
await handleDynamicField(page, 'שם פרטי איש קשר', data.contactFirstName);
await handleDynamicField(page, 'שם משפחה איש קשר', data.contactLastName);
await handleDynamicField(page, 'טלפון איש קשר', data.contactPhone);
await handleDynamicField(page, 'אימייל איש קשר', data.contactEmail);


/*
const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();

  for (let i = 0; i < count-1; i++) {
    await checkboxes.nth(i).check({ force: true });
  }*/
await page.getByRole('button', { name: 'המשך לשלב הבא' }).click();
//const startSign = page.getByRole('button', { name: 'התחל חתימה על ההסכם' });
const startAuth = page.getByRole('button', { name: 'התחל אימות' });

try {
  await startAuth.waitFor({ state: 'visible', timeout: 5000 });
  await startAuth.click();
} catch {
  console.log('הכפתור לא הופיע');
}

const contBtn = page.getByRole('button', { name: 'המשך' });

try {
  await contBtn.waitFor({ state: 'visible', timeout: 5000 });
  await contBtn.click();
} catch {
  console.log('הכפתור לא הופיע');
}

const raw = fs.readFileSync(
  path.resolve(__dirname, '../data/FormData.json'),
  'utf-8'
).trim();

if (!raw) {
  throw new Error('FormData.json is empty');
}

const dataForm = JSON.parse(raw);
//מילוי שאלונים
await fillForm(page, 'שם מלא', dataForm.personalDetails.fullName);
await fillForm(page, 'מספר זהות', dataForm.personalDetails.idNumber);
await fillForm(page, 'מדינת אזרחות', dataForm.personalDetails.citizenship);
await fillForm(page, 'כתובת', dataForm.personalDetails.address);

// תאריך לידה
await page
  .getByPlaceholder('dd/mm/yyyy')
  .fill(toDateInputFormat(dataForm.personalDetails.birthDate));
// מגדר (רדיו)
if (dataForm.personalDetails.gender === 'male') {
  await page.getByRole('radio', { name: 'ז' }).check();
} else {
  await page.getByRole('radio', { name: 'נ' }).check();
}
const buttons = page.getByRole('button', { name: 'המשך' });
await buttons.nth(1).click();
/*const startSign = page.getByRole('button', { name: 'התחל חתימה על ההסכם' });
try {
  await startSign.waitFor({ state: 'visible', timeout: 5000 });
  await startSign.click();
} catch {
  console.log('הכפתור לא הופיע');
}
if (await startAuth.count() > 0) {
  await startAuth.click();
} else if (await startSign.count() > 0) {
  await startSign.click();

const checkboxes2 = page.locator('input[type="checkbox"]');
  
    await checkboxes2.nth(0).check({ force: true });
 //השתמש בעורך דין שלך
    await page.locator('input[type="radio"]').nth(0).check();
  await page.getByRole('button', { name: 'המשך' }).click();
  await page.getByRole('textbox', { name: 'אימייל עורך דין' })
  .fill('new-email@example.com');
  await page.getByRole('textbox', { name: 'שם עורך דין' })
  .fill('עוד טסט');
  await page.getByRole('button', { name: 'המשך' }).click();
   await page.getByRole('textbox', { name: 'תפקיד' })
  .fill('טסט תפקיד');
 // await page.getByRole('button', { name: 'שלח לחתימת עורך דין' }).click();
  const sendBtn = page.getByRole('button', { name: /המשך/ });
await expect(sendBtn).toBeVisible();
await expect(sendBtn).toBeEnabled();
await sendBtn.click();

await page.locator('input[type="radio"]').nth(1).check();

  await page.getByRole('button', { name: 'המשך' }).click();
  await page.getByRole('textbox', { name: 'תפקיד' })
  .fill('טסט תפקיד');
  await page.getByRole('button', { name: 'המשך' }).click();
}*/

  await page.pause(); // מצוין לניטור התוצאות בסיום

});




