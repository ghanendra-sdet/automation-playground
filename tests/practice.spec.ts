import { test, expect } from '@playwright/test';

test.describe('Automation Practice Playground', () => {
  test.beforeEach(async ({ page }) => {
    // Listen for browser console logs and uncaught exceptions
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.error(`[BROWSER UNCAUGHT ERROR] ${err.stack || err.message}`);
    });

    // Listen for network requests and responses
    page.on('request', req => console.log(`>> REQ: [${req.method()}] ${req.url()}`));
    page.on('response', res => console.log(`<< RES: [${res.status()}] ${res.url()}`));

    // Navigate to the local practice app homepage
    await page.goto('/');
  });

  test('Challenge 01: Basic Form Elements', async ({ page }) => {
    // Fill out the form fields using data-testid locators
    await page.getByTestId('form-name').fill('Playwright Tester');
    await page.getByTestId('form-email').fill('tester@playwright.dev');
    await page.getByTestId('form-password').fill('securePassword123');
    await page.getByTestId('form-phone').fill('+1234567890');
    await page.getByTestId('form-bio').fill('This is a test bio for UI verification.');

    // Submit the form
    await page.getByTestId('form-submit').click();

    // Verify the status panel prints the successful entry details
    const status = page.getByTestId('form-status');
    await expect(status).toHaveText(/Submitted successfully!/);
    await expect(status).toHaveText(/Name: "Playwright Tester"/);
    await expect(status).toHaveText(/Email: "tester@playwright.dev"/);
  });

  test('Challenge 02: Button Interactions', async ({ page }) => {
    // 1. Single click
    await page.getByTestId('btn-click').click();
    await expect(page.getByTestId('status-click')).toHaveText('Clicked');

    // 2. Double click
    await page.getByTestId('btn-double-click').dblclick();
    await expect(page.getByTestId('status-double-click')).toHaveText('Double-clicked');

    // 3. Right click (context click)
    await page.getByTestId('btn-right-click').click({ button: 'right' });
    await expect(page.getByTestId('status-right-click')).toHaveText('Right-clicked');

    // 4. Delayed Enable (Wait up to 3 seconds for element to be enabled)
    const delayedBtn = page.getByTestId('btn-delayed');
    await expect(delayedBtn).toBeEnabled({ timeout: 4000 });
    await delayedBtn.click();
    await expect(delayedBtn).toHaveText('Enabled & Clicked!');
  });

  test('Challenge 07: Waits & Synchronisation (Spinner)', async ({ page }) => {
    // Locate the spinner status text
    const statusSpinner = page.getByTestId('status-spinner');
    
    // Playwright automatically retries assertion until condition is met (up to default/custom timeout)
    // The spinner changes from "Loading spinner..." to "Loaded!" in exactly 4 seconds.
    await expect(statusSpinner).toHaveText('Loaded!', { timeout: 5000 });
  });

  test('Challenge 11: iFrame Interaction', async ({ page }) => {
    // Locate the frame using its selector or testid
    const frame = page.frameLocator('[data-testid="iframe-challenge-frame"]');

    // Fill the input inside the frame
    const input = frame.getByTestId('iframe-input-test');
    await input.fill('Message from automation parent');

    // Click submit inside frame
    await frame.getByTestId('iframe-submit-btn').click();

    // Verify status inside the frame
    const status = frame.locator('#iframe-status');
    await expect(status).toBeVisible();
    await expect(status).toHaveText(/Form submitted with value: "Message from automation parent"/);
  });

  test('Challenge 12: Shadow DOM Piercing', async ({ page }) => {
    // Playwright pierces Shadow DOM boundaries natively! 
    // You can locate shadow elements using standard selectors as if they were in the light DOM.
    const shadowInput = page.locator('#shadow-container').locator('#shadow-input');
    await shadowInput.fill('SECRET_SHADOW_KEY');

    const shadowBtn = page.locator('#shadow-container').locator('#shadow-btn');
    await shadowBtn.click();

    const shadowStatus = page.locator('#shadow-container').locator('#shadow-status');
    await expect(shadowStatus).toBeVisible();
    await expect(shadowStatus).toHaveText(/Shadow DOM Key Accepted: "SECRET_SHADOW_KEY"/);
  });

  test('Challenge 25: Flaky Operations (Automatic Retries)', async ({ page }) => {
    // The flaky button fails 50% of the time, simulating unstable end-points.
    // Playwright's automatic retry at the test level (configured in playwright.config.ts)
    // will cause this test to retry if it fails on the first run, passing on subsequent attempts.
    await page.locator('#btn-trigger-flaky').click();
    await expect(page.locator('#flaky-status')).toHaveText('Success: Transaction processed!');
  });
});
