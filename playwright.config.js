
require('dotenv').config();
// @ts-check
const { defineConfig, devices } = require('@playwright/test');
// playwright.config.js
module.exports = defineConfig({
  // 1. הנתיב לתיקיית הטסטים
  // אם הקובץ יושב בתוך תיקיית tests, שנה ל- './'
  // אם הוא יושב מחוץ לתיקייה, השאר './tests'
  testDir: './', 

  // 2. תבנית השמות של הקבצים (חשוב לוודא שזה כולל .js)
  testMatch: '**/*.spec.js',

  /* הרצה במקביל */
  fullyParallel: false,
  /* עצירה אחרי כישלון אחד (נוח בטעינת נתונים) */
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,

  /* הגדרות דיווח */
  reporter: 'html',

  /* הגדרות גלובליות לדפדפן */
  use: {
   // עכשיו אפשר להשתמש בכתובת האתר כברירת מחדל
    baseURL: process.env.BASE_URL,
    // האם להריץ עם דפדפן פתוח כברירת מחדל
    headless: false, 

    // צילום מסך אוטומטי במקרה של כישלון
    screenshot: 'only-on-failure',
    
    // הקלטת וידאו של הטסט (מעולה לניפוי שגיאות)
    video: 'retain-on-failure',
  },

  /* הגדרת דפדפנים */
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }, // או iPhone SE וכו'
    },
  ],
 
});