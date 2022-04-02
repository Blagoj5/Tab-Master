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

const extensionChromePath = path.resolve(__dirname, '../../build-chrome');
// const extensionFirefoxLocation = path.resolve(__dirname, 'build-firefox');

// ** This keeps the same context without closing it, the closing happens in the last test case
let context: BrowserContext;
export const test = base.extend({
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
  },
});

export { expect };

// * This will refresh the context/browser for each test
// const test = base.extend({
//   context: async ({ browserName }, use) => {
//     const browserTypes: Record<
//       PlaywrightWorkerOptions['browserName'],
//       typeof chromium
//     > = { chromium, webkit, firefox };
//     const userDataDir = '/tmp/test-user-data-dir';
//     const context = await browserTypes[browserName].launchPersistentContext(
//       userDataDir,
//       {
//         // devtools: true,
//         headless: false,
//         viewport: { width: 1280, height: 720 },
//         args: [
//           `--disable-extensions-except=${extensionChromePath}`,
//           `--load-extension=${extensionChromePath}`,
//         ],
//       },
//     );
//     await use(context);
//     await context.close();
//   },
// });
