import type { Browser, HTTPResponse, Page } from 'puppeteer';
import { intersectionRecentTabsComplement, openTabs, recentTabs } from './data';
import { getActivePage } from './utils/getActivePage';
import closeExtension from './utils/closeTabMaster';
import {
  openExtensionMac,
  openExtensionNativeMac,
  openExtensionNativeWinOrUb,
  openExtensionWindowsOrUb,
} from './utils/openTabMaster';
import sleep from './utils/sleep';
import Navigator from './utils/Navigator';

describe('Test open commands - MacOS', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  it('Should toggle - CMD + K', async () => {
    // TOGGLE
    await openExtensionMac(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();
    let el = await frame.waitForSelector(selector);

    expect(el).toBeTruthy();

    await openExtensionMac(); // CLOSE
    el = await frame.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - CMD + K then Escape', async () => {
    // TOGGLE
    await openExtensionMac(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();
    let el = await frame.waitForSelector(selector);

    expect(el).toBeTruthy();

    await closeExtension(); // CLOSE
    el = await frame.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - CMD + Shift + K then Escape', async () => {
    // TOGGLE
    await openExtensionNativeMac(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();
    let el = await frame.waitForSelector(selector);

    expect(el).toBeTruthy();

    await closeExtension(); // CLOSE
    el = await frame.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - CMD + Shift + K then CMD + K', async () => {
    // TOGGLE
    await openExtensionNativeMac(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();
    let el = await frame.waitForSelector(selector);

    expect(el).toBeTruthy();

    await openExtensionMac(); // CLOSE
    el = await frame.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });
});

describe('Test open commands - Rest OS', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  it('Should toggle - Control + K', async () => {
    // TOGGLE
    await openExtensionWindowsOrUb(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();
    let el = await frame.waitForSelector(selector);

    expect(el).toBeTruthy();

    await openExtensionWindowsOrUb(); // CLOSE
    el = await frame.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - Control + K then Escape', async () => {
    // TOGGLE
    await openExtensionWindowsOrUb(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();
    let el = await frame.waitForSelector(selector);

    expect(el).toBeTruthy();

    await closeExtension(); // CLOSE
    el = await frame.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - Control + Shift + K then Escape', async () => {
    // TOGGLE
    await openExtensionNativeWinOrUb(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();
    let el = await frame.waitForSelector(selector);

    expect(el).toBeTruthy();

    await closeExtension(); // CLOSE
    el = await frame.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - Control + Shift + K then Control + K', async () => {
    // TOGGLE
    await openExtensionNativeWinOrUb(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();
    let el = await frame.waitForSelector(selector);

    expect(el).toBeTruthy();

    await openExtensionWindowsOrUb(); // CLOSE
    el = await frame.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });
});

describe('Test TAB iteration', () => {
  let currentPage: Page;
  beforeAll(async () => {
    await jestPuppeteer.resetBrowser();
    const recentPages: Page[] = [];
    const recentPagesPromises: Promise<HTTPResponse>[] = [];
    for (const site of recentTabs) {
      const newPage = await (browser as unknown as Browser).newPage();
      recentPagesPromises.push(newPage.goto(site));
      recentPages.push(newPage);
    }
    await Promise.all(recentPagesPromises);
    await Promise.all(recentPages.map((page) => page.close()));

    const openedPages: Page[] = [page];
    const openPagesPromises: Promise<HTTPResponse>[] = [];
    for (const site of openTabs) {
      // TODO: fix this
      const newPage = await (browser as unknown as Browser).newPage();
      openPagesPromises.push(newPage.goto(site));
      openedPages.push(newPage);
      await sleep(100);
    }
    await Promise.allSettled(openPagesPromises);
    currentPage = await getActivePage(browser);
    await currentPage.bringToFront();
  });

  afterEach(async () => {
    await closeExtension(currentPage);
  });

  it('Should use Arrow Keys to navigate trough tabs', async () => {
    const getSelector = (i: number) => `[data-testselected="selected-${i}"`;
    const navigator = new Navigator(
      currentPage,
      openTabs.length - 1 + 1, // + 1 for the about tab from puppeteer
      intersectionRecentTabsComplement.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await sleep(300);

    const moveDown = async () => {
      await navigator.moveDown();
      const el = await frame.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const moveUp = async () => {
      await navigator.moveUp();
      const el = await frame.$(getSelector(navigator.index));
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

  it('Should use SHIFT + RightKey&LeftKey to toggle collapse/expand', async () => {
    const getSelector = (i: number) => `[data-testexpanded="expanded-${i}"`;
    const navigator = new Navigator(
      currentPage,
      openTabs.length - 1 + 1, // + 1 for the about tab from puppeteer
      intersectionRecentTabsComplement.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await sleep(300);

    const moveDown = async () => {
      await navigator.moveDownAndExpand();
      const el = await frame.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const moveUp = async () => {
      await navigator.moveUpAndExpand();
      const el = await frame.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const collapse = async () => {
      await navigator.collapse();
      const el = await frame.$(getSelector(navigator.index));
      expect(el).toBeNull();
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

  it('Should use TAB to toggle collapse/expand', async () => {
    const getSelector = (i: number) => `[data-testexpanded="expanded-${i}"`;
    const navigator = new Navigator(
      currentPage,
      openTabs.length - 1 + 1, // + 1 for the about tab from puppeteer
      intersectionRecentTabsComplement.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await sleep(300);

    const moveDown = async () => {
      await navigator.moveDownAndExpand(true);
      const el = await frame.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const moveUp = async () => {
      await navigator.moveUpAndExpand(true);
      const el = await frame.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const toggleCollapse = async () => {
      await navigator.toggleExpandCollapse();
      const el = await frame.$(getSelector(navigator.index));
      expect(el).toBeNull();
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
