import { test, expect } from './setup/extension-test';

import { intersectionRecentTabsComplement, openTabs } from './data';
import { openExtensionWindowsOrUb } from './utils/openTabMaster';
import Navigator from './utils/Navigator';
import { openRecentTabs } from './utils/openRecentTabs';
import { openOpenedTabs } from './utils/openOpenedTabs';
import sleep from './utils/sleep';

test.describe('Test functionality without keyword', () => {
  test.beforeAll(async ({ page, context }) => {
    await openRecentTabs(context);
    await openOpenedTabs(context, page);
  });

  // TODO: implement
  // afterAll(async () => {
  //   const pages = await browser.pages();
  //   const closePagesPromises = pages.map((page) => {
  //     if (page.url() === 'about:blank')
  //       return new Promise<void>((res) => res());
  //     return page.close();
  //   });
  //   Promise.all(closePagesPromises);
  // });

  const testCases = [
    ['Five down', 5],
    ['Four down', 4],
    ['Three down', 3],
    ['Two down', 2],
    ['Same position', 0],
  ] as const;
  for (const testCase of testCases) {
    test(`Should navigate trough recent tabs - ${testCase[0]}`, async ({
      page,
      context,
    }) => {
      if (page.url().includes(':blank')) await page.close();
      const movesDown = testCase[1];
      const currentPage = context
        .pages()
        .find((ctxPage) => ctxPage.url().includes('google'));

      if (!currentPage) throw new Error('Current page does not exist');

      const getSelector = (i: number) => `[@data-testselected="selected-${i}"]`;
      const ABOUT_TAB_COUNT = 1;
      const CURRENT_OPEN_TAB_COUNT = -1; // current tab is not shown in opened tabs

      const navigator = new Navigator(
        currentPage,
        openTabs.length - 1 + ABOUT_TAB_COUNT + CURRENT_OPEN_TAB_COUNT, // + 1 for the about tab from puppeteer
        intersectionRecentTabsComplement.length - 1, //
      );

      // TOGGLE
      await openExtensionWindowsOrUb(currentPage); // OPEN
      await page.waitForTimeout(300);

      // First recent tab is selected
      await navigator.startFromRecentTabs();
      await navigator.moveDownMultiple(movesDown);

      const frameLocator = currentPage.frameLocator('iframe#tab-master');
      const selections = await frameLocator
        .locator(`//*${getSelector(navigator.index)}//p`)
        .allTextContents();
      // title and url
      expect(selections).toHaveLength(2);
      // const selectionTitle = await selections[0].evaluate(
      //   (el) => el.textContent,
      // );
      // const selectionUrl = await selections[1].evaluate((el) => el.textContent);
      const selectionTitle = selections[0];
      const selectionUrl = selections[1];

      // const oldCurrentTitle = await currentPage.title();
      const oldPageCount = context.pages().length;

      // click on recent tab, open a new one
      await navigator.navigate();
      await sleep(500);
      const newPage = context.pages().slice(-1)[0];
      expect(context.pages().map((p) => p.url())).toContain(selectionUrl);
      const titles = await Promise.all(context.pages().map((p) => p.title()));
      expect(titles).toContain(selectionTitle);

      // const currentPageTitle = await currentPage.title();
      // const currentPageUrl = currentPage.url();

      // expect(oldCurrentTitle).not.toEqual(currentPageTitle);
      // expect(currentPageTitle).toBe(selectionTitle);
      // expect(currentPageUrl).toBe(selectionUrl);

      const currentPageCount = context.pages().length;
      expect(oldPageCount + 1).toBe(currentPageCount);

      // close the opened page
      await newPage?.close();
    });
  }
  const testCases2 = [
    ['Five down', 5],
    ['Four down', 4],
    ['Three down', 3],
    ['Two down', 2],
  ] as const;
  for (const testCase of testCases2) {
    test(`Should navigate trough opened tabs - ${testCase[0]}`, async ({
      page,
      context,
    }) => {
      if (page.url().includes(':blank')) await page.close();
      const movesDown = testCase[1];
      const currentPage = context
        .pages()
        .find((ctxPage) => ctxPage.url().includes('google'));

      if (!currentPage) throw new Error('Current page does not exist');

      const ABOUT_TAB_COUNT = 1;
      const CURRENT_OPEN_TAB_COUNT = -1; // current tab is not shown in opened tabs
      const navigator = new Navigator(
        currentPage,
        openTabs.length - 1 + ABOUT_TAB_COUNT + CURRENT_OPEN_TAB_COUNT, // + 1 for the about tab from puppeteer
        intersectionRecentTabsComplement.length - 1, //
      );

      // TOGGLE
      await openExtensionWindowsOrUb(currentPage); // OPEN
      await page.waitForTimeout(300);

      // First recent tab is selected
      await navigator.startFromOpenTabs();
      await navigator.moveDownMultiple(movesDown);

      // const getSelector = (i: number) => `[@data-testselected="selected-${i}"]`;
      // const expectSelection = async () => {
      //   const frameLocator = currentPage.frameLocator('iframe#tab-master');
      //   const selections = await frameLocator
      //     .locator(`//*${getSelector(navigator.index)}//p`)
      //     .allTextContents();

      //   // title and url
      //   expect(selections).toHaveLength(2);
      //   const selectionTitle = selections[0];
      //   const selectionUrl = selections[1];
      //   return [selectionTitle, selectionUrl];
      // };

      // const [selectionTitle, selectionUrl] = await expectSelection();

      // const oldCurrentTitle = await currentPage.title();
      const oldPageCount = context.pages().length;

      // click on open tab, switch
      await navigator.navigate();

      // since I can't get the current opened Tab, I'm going to check if tab-master is closed after switch
      const frameLocator = currentPage.frameLocator('iframe#tab-master');
      expect(
        frameLocator.locator("*[data-testid='open-modal']"),
      ).not.toBeVisible();

      const currentPageCount = context.pages().length;
      expect(oldPageCount).toBe(currentPageCount);
    });
  }
});

// describe('Test functionality with keyword', () => {
//   beforeAll(async () => { //   });

//   it('Should navigate trough recent opened tabs with keyword: <site>', async () => {});

//   it('Should navigate trough recent opened tabs with keyword: <title>', async () => {});

//   it('Should navigate trough recent opened tabs with keyword: <site>:<title>', async () => {});

//   it('Should navigate trough opened tabs with keyword: <site>', async () => {});

//   it('Should navigate trough opened tabs with keyword: <title>', async () => {});

//   it('Should navigate trough opened tabs with keyword: <site>:<title>', async () => {});

//   it('Should navigate trough recently opened and currently opened tabs with keyword: <site>', async () => {});

//   it('Should navigate trough recently opened and currently opened tabs with keyword: <title>', async () => {});

//   it('Should navigate trough recently opened and currently opened tabs with keyword: <site>:<title>', async () => {});
// });
