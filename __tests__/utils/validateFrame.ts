import { Page } from '@playwright/test';

export async function validateFrame(page: Page) {
  const elementHandle = await page.waitForSelector('iframe#tab-master');
  const frame = await elementHandle?.contentFrame();

  if (!frame) throw new Error('No frame');

  return { frame };
}
