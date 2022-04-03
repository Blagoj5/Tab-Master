import { expect, test } from './setup/extension-test';
import {
  openExtensionMac,
  openExtensionNativeMac,
  openExtensionNativeWinOrUb,
  openExtensionWindowsOrUb,
} from './utils/openTabMaster';
import closeExtension from './utils/closeTabMaster';
import { openRecentTabs } from './utils/openRecentTabs';
import { openOpenedTabs } from './utils/openOpenedTabs';
import Navigator from './utils/Navigator';
import { Page } from '@playwright/test';

test.afterAll(({ context }) => {
  context.close();
});

test.describe('Tab-master - basic commands', () => {
  test.describe('Test open commands - MacOS', () => {
    const testCases = [
      ['Should toggle - CMD + K', openExtensionMac, openExtensionMac],
      [
        'Should open then close - CMD + K then Escape',
        openExtensionMac,
        closeExtension,
      ],
      [
        'Should toggle - CMD + Shift + K',
        openExtensionNativeMac,
        openExtensionNativeMac,
      ],
      [
        'Should open then close - CMD + Shift + K then Escape',
        openExtensionNativeMac,
        closeExtension,
      ],
      [
        'Should open then close - CMD + Shift + K then CMD + K',
        openExtensionNativeMac,
        openExtensionMac,
      ],
    ] as const;

    for (const testCase of testCases) {
      test(testCase[0], async ({ page, context }) => {
        const currentPage =
          context.pages().find((p) => p.url().includes('google')) || page;
        await currentPage.bringToFront();
        if (currentPage !== page) await page.close();
        await basicFuncTest(currentPage, testCase[1], testCase[2]);
      });
    }
  });

  test.describe('Test open commands - Rest OS', () => {
    const testCases = [
      [
        'Should toggle - CTRL + K',
        openExtensionWindowsOrUb,
        openExtensionWindowsOrUb,
      ],
      [
        'Should open then close - CTRL + K then Escape',
        openExtensionWindowsOrUb,
        closeExtension,
      ],
      [
        'Should toggle - CTRL + Shift + K',
        openExtensionNativeWinOrUb,
        openExtensionNativeWinOrUb,
      ],
      [
        'Should open then close - Control + Shift + K then Escape',
        openExtensionNativeWinOrUb,
        closeExtension,
      ],
      [
        'Should open then close - Control + Shift + K then Control + K',
        openExtensionNativeWinOrUb,
        openExtensionWindowsOrUb,
      ],
    ] as const;

    for (const testCase of testCases) {
      test(testCase[0], async ({ page, context }) => {
        const currentPage =
          context.pages().find((p) => p.url().includes('google')) || page;
        await currentPage.bringToFront();
        if (currentPage !== page) await page.close();
        await basicFuncTest(currentPage, testCase[1], testCase[2]);
      });
    }
  });
});

test.describe('Test TAB iteration', () => {
  let currentPage: Page | undefined;
  test.beforeAll(async ({ context, page }) => {
    await openRecentTabs(context);
    await openOpenedTabs(context, page);
  });

  test.afterEach(async () => {
    if (!currentPage) throw new Error('No current page');
    await closeExtension(currentPage);
  });

  test('Should use Arrow Keys to navigate trough tabs', async ({
    page,
    context,
  }) => {
    await page.close();

    currentPage = context.pages().find((page) => page.url().includes('google'));
    if (!currentPage) throw new Error('No current page');

    currentPage.bringToFront();
    const getSelector = (i: number) => `[data-testselected="selected-${i}"]`;
    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await currentPage.waitForTimeout(500);

    const frameLocator = currentPage.frameLocator('iframe#tab-master');
    const navigator = await Navigator.getNavigator(currentPage, frameLocator);
    const moveDown = async () => {
      await navigator.moveDown();
      const el = await frameLocator
        .locator(getSelector(navigator.index))
        .elementHandle();
      expect(el).toBeTruthy();
    };
    const moveUp = async () => {
      await navigator.moveUp();
      const el = await frameLocator
        .locator(getSelector(navigator.index))
        .elementHandle();
      expect(el).toBeTruthy();
    };
    // ↴
    await moveDown();
    // ↴
    await moveDown();
    // ⤴
    await moveUp();
    // ⤴
    await moveUp();
    // ⤴, the last item should be selected
    await moveUp();
  });

  test('Should use SHIFT + RightKey&LeftKey to toggle collapse/expand', async ({
    page,
    context: ctx,
  }) => {
    await page.close();
    currentPage = ctx.pages().find((page) => page.url().includes('google'));
    if (!currentPage) throw new Error('No current page');
    currentPage.bringToFront();

    const getSelector = (i: number) => `[data-testexpanded="expanded-${i}"]`;

    const frameLocator = currentPage.frameLocator('iframe#tab-master');
    const navigator = await Navigator.getNavigator(currentPage, frameLocator);
    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await currentPage.waitForTimeout(2000);
    const moveDown = async () => {
      await navigator.moveDownAndExpand();
      const el = await frameLocator
        .locator(getSelector(navigator.index))
        .elementHandle({ timeout: 1500 });
      expect(el).toBeTruthy();
    };
    const moveUp = async () => {
      await navigator.moveUpAndExpand();
      const el = await frameLocator
        .locator(getSelector(navigator.index))
        .elementHandle({ timeout: 1500 });
      expect(el).toBeTruthy();
    };
    const collapse = async () => {
      await navigator.collapse();
      const elLocator = frameLocator.locator(getSelector(navigator.index));
      expect(elLocator).toBeEmpty();
    };
    // ↴
    await moveDown();
    // collapse
    await collapse();
    // ↴
    await moveDown();
    // collapse
    await collapse();
    // ⤴
    await moveUp();
    // collapse
    await collapse();
    // ⤴
    await moveUp();
    // collapse
    await collapse();
    // ⤴, the last item should be selected
    await moveUp();
    // collapse
    await collapse();
  });

  test('Should use TAB to toggle collapse/expand', async ({
    page,
    context,
  }) => {
    await page.close();
    currentPage = context.pages().find((page) => page.url().includes('google'));
    if (!currentPage) throw new Error('No current page');
    currentPage.bringToFront();
    const getSelector = (i: number) => `[data-testexpanded="expanded-${i}"]`;
    const frameLocator = currentPage.frameLocator('iframe#tab-master');
    const navigator = await Navigator.getNavigator(currentPage, frameLocator);
    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await page.waitForTimeout(300);
    const moveDown = async () => {
      await navigator.moveDownAndExpand(true);
      const el = await frameLocator
        .locator(getSelector(navigator.index))
        .elementHandle();
      expect(el).toBeTruthy();
    };
    const moveUp = async () => {
      await navigator.moveUpAndExpand(true);
      const el = await frameLocator
        .locator(getSelector(navigator.index))
        .elementHandle();
      expect(el).toBeTruthy();
    };
    const toggleCollapse = async () => {
      await navigator.toggleExpandCollapse();
      const el = frameLocator.locator(getSelector(navigator.index));
      expect(el).toBeEmpty();
    };
    // ↴
    await moveDown();
    // collapse
    await toggleCollapse();
    // ↴
    await moveDown();
    // collapse
    await toggleCollapse();
    // ⤴
    await moveUp();
    // ⤴
    await moveUp();
    // ⤴, the last item should be selected
    await moveUp();
    // collapse
    await toggleCollapse();
  });
});

async function basicFuncTest(
  page: Page,
  openFn: (selectedPage: Page) => Promise<void>,
  closeFn: (selectedPage: Page) => Promise<void>,
) {
  // initalize only the first time
  if (!page.url().includes('google.com')) {
    await page.goto('https://google.com');
    await page.bringToFront();
  }

  const selector = '*[data-testid="open-modal"]';
  const frameLocator = page.frameLocator('iframe#tab-master');

  // TOGGLE
  await openFn(page); // OPEN

  let isShown = !(await frameLocator.locator(selector).isHidden());

  expect(isShown).toBe(true);

  await closeFn(page); // CLOSE

  isShown = !(await frameLocator.locator(selector).isHidden());
  expect(isShown).toBe(false);

  await expect(page.title()).resolves.toMatch('Google');
}
