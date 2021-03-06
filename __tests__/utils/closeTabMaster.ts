import { Page } from '@playwright/test';

// keyboard: https://github.com/puppeteer/puppeteer/blob/main/src/common/USKeyboardLayout.ts
const closeExtension = async (currentPage: Page) => {
  await currentPage.keyboard.press('Escape');
};

export default closeExtension;
