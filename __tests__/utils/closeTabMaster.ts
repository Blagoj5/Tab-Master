import { Page } from 'puppeteer';

// keyboard: https://github.com/puppeteer/puppeteer/blob/main/src/common/USKeyboardLayout.ts
const closeExtension = async (currentPage: Page = page) => {
  await currentPage.keyboard.press('Escape');
};

export default closeExtension;
