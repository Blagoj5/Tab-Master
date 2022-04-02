import {
  test as base,
  chromium,
  firefox,
  webkit,
  PlaywrightWorkerOptions,
  BrowserContext,
  expect,
} from '@playwright/test';
import path from 'path';
import Commands from './utils/commands';
import { openOpenedTabs } from './utils/openOpenedTabs';
import { openExtensionWindowsOrUb } from './utils/openTabMaster';

const extensionChromePath = path.resolve(__dirname, '../build-chrome');
// const extensionFirefoxLocation = path.resolve(__dirname, 'build-firefox');

let context: BrowserContext;
const test = base.extend({
  context: async ({ browserName }, use) => {
    const browserTypes: Record<
      PlaywrightWorkerOptions['browserName'],
      typeof chromium
    > = { chromium, webkit, firefox };
    const userDataDir = '/tmp/test-user-data-dir';
    if (!context) {
      context = await browserTypes[browserName].launchPersistentContext(
        userDataDir,
        {
          // devtools: true,
          headless: false,
          viewport: { width: 1280, height: 720 },
          args: [
            `--disable-extensions-except=${extensionChromePath}`,
            `--load-extension=${extensionChromePath}`,
          ],
        },
      );
    }
    await use(context);
    // await context.close(); // DON'T NEED THIS
  },
});

test.afterAll(({ context }) => {
  context.close();
});

test('Close Tab - CMD + X', async ({ page, context }) => {
  await openOpenedTabs(context, page);

  const initialPagesCount = context.pages().length;
  const currentPage = context
    .pages()
    .find((contextPage) => contextPage.url().includes('google'));

  if (!currentPage) throw new Error('No current page');

  await currentPage.bringToFront();
  await openExtensionWindowsOrUb(currentPage);
  await currentPage.waitForTimeout(500);
  await page.pause();
  const commands = new Commands(currentPage);
  await commands.closeTab();
  let deletedPageCount = context.pages().length;
  await page.pause();
  expect(deletedPageCount).toBe(initialPagesCount - 1);
  // TODO: Check if tab is deleted
  // const deletedPage = context
  //   .pages()
  //   .find((contextPage) => contextPage.url().includes('google'));
  await commands.closeTab();
  deletedPageCount = context.pages().length;
  expect(deletedPageCount).toBe(initialPagesCount - 2);
});
