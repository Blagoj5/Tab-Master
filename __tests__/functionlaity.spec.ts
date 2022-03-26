import { validateFrame } from './utils/validateFrame';
import { intersectionRecentTabsComplement, openTabs } from './data';
import { openExtensionWindowsOrUb } from './utils/openTabMaster';
import sleep from './utils/sleep';
import Navigator from './utils/Navigator';
import getPageCount from './utils/getPageCount';
import closeExtension from './utils/closeTabMaster';
import { openRecentTabs } from './utils/openRecentTabs';
import { openOpenedTabs } from './utils/openOpenedTabs';

describe('Test functionality without keyword', () => {
  beforeAll(async () => {
    await jestPuppeteer.resetBrowser();
    await openRecentTabs();
    await openOpenedTabs();
  });

  afterAll(async () => {
    const pages = await browser.pages();
    const closePagesPromises = pages.map((page) => {
      if (page.url() === 'about:blank')
        return new Promise<void>((res) => res());
      return page.close();
    });
    Promise.all(closePagesPromises);
  });
  test.each([
    ['Five down', 5],
    ['Four down', 4],
    ['Three down', 3],
    ['Two down', 2],
    ['Same position', 0],
  ])(
    'Should navigate trough recent tabs - %s',
    async (_, movesDown) => {
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
      await sleep(300);

      // First recent tab is selected
      await navigator.startFromRecentTabs();
      await navigator.moveDownMultiple(movesDown);

      const selections = await frame.$x(
        `//*${getSelector(navigator.index)}//p`,
      );
      // title and url
      expect(selections).toHaveLength(2);
      const selectionTitle = await selections[0].evaluate(
        (el) => el.textContent,
      );
      const selectionUrl = await selections[1].evaluate((el) => el.textContent);

      const oldCurrentTitle = await currentPage.title();
      const oldPageCount = (await browser.pages()).length;

      // click on recent tab, open a new one
      currentPage = await navigator.navigate();
      const currentPageTitle = await currentPage.title();
      const currentPageUrl = currentPage.url();

      expect(oldCurrentTitle).not.toEqual(currentPageTitle);
      expect(currentPageTitle).toBe(selectionTitle);
      expect(currentPageUrl).toBe(selectionUrl);
      expect(currentPageUrl).toBe(selectionUrl);

      const currentPageCount = (await browser.pages()).length;
      expect(oldPageCount + 1).toBe(currentPageCount);

      // close the opened page
      await currentPage.close();
    },
    3000000,
  );

  test.each([
    ['Five down', 5],
    ['Four down', 4],
    ['Three down', 3],
    ['Two down', 2],
  ])(
    'Should navigate trough opened tabs - %s',
    async (_, movesDown) => {
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
      await sleep(300);

      // First recent tab is selected
      await navigator.startFromOpenTabs();
      await navigator.moveDownMultiple(movesDown);

      const expectSelection = async () => {
        const { frame } = await validateFrame();
        const selections = await frame.$x(
          `//*${getSelector(navigator.index)}//p`,
        );

        // title and url
        expect(selections).toHaveLength(2);
        const selectionTitle = await selections[0].evaluate(
          (el) => el.textContent,
        );
        const selectionUrl = await selections[1].evaluate(
          (el) => el.textContent,
        );
        return [selectionTitle, selectionUrl];
      };

      const [selectionTitle, selectionUrl] = await expectSelection();

      const oldCurrentTitle = await currentPage.title();
      const oldPageCount = await getPageCount();

      // click on open tab, switch
      currentPage = await navigator.navigate();
      const currentPageTitle = await currentPage.title();
      const currentPageUrl = currentPage.url();

      expect(oldCurrentTitle).not.toEqual(currentPageTitle);
      expect(currentPageTitle).toBe(selectionTitle);
      expect(currentPageUrl).toBe(selectionUrl);

      const currentPageCount = (await browser.pages()).length;
      expect(oldPageCount).toBe(currentPageCount);

      await closeExtension();
    },
    3000000,
  );
});

describe('Test functionality with keyword', () => {
  beforeAll(async () => {
    await jestPuppeteer.resetBrowser();
    await openRecentTabs();
    await openRecentTabs();
  });

  it('Should navigate trough recent opened tabs with keyword: <site>', async () => {});

  it('Should navigate trough recent opened tabs with keyword: <title>', async () => {});

  it('Should navigate trough recent opened tabs with keyword: <site>:<title>', async () => {});

  it('Should navigate trough opened tabs with keyword: <site>', async () => {});

  it('Should navigate trough opened tabs with keyword: <title>', async () => {});

  it('Should navigate trough opened tabs with keyword: <site>:<title>', async () => {});

  it('Should navigate trough recently opened and currently opened tabs with keyword: <site>', async () => {});

  it('Should navigate trough recently opened and currently opened tabs with keyword: <title>', async () => {});

  it('Should navigate trough recently opened and currently opened tabs with keyword: <site>:<title>', async () => {});
});
