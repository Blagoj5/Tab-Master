import type { Browser, HTTPResponse, Page } from 'puppeteer';
import {
  INTERSECTION_RECENT_TABS_COMPLEMENT,
  OPEN_TABS,
  RECENT_TABS,
} from './consts';
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
    // for (const site of RECENT_TABS) {
    //   await page.goto(site);
    // }
    const recentPages: Page[] = [];
    const recentPagesPromises: Promise<HTTPResponse>[] = [];
    for (const site of RECENT_TABS) {
      const newPage = await (browser as unknown as Browser).newPage();
      recentPagesPromises.push(newPage.goto(site));
      recentPages.push(newPage);
    }
    await Promise.all(recentPagesPromises);
    await Promise.all(recentPages.map((page) => page.close()));

    const openedPages: Page[] = [page];
    const openPagesPromises: Promise<HTTPResponse>[] = [];
    for (const site of OPEN_TABS) {
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
      OPEN_TABS.length - 1 + 1, // + 1 for the about tab from puppeteer
      INTERSECTION_RECENT_TABS_COMPLEMENT.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN

    await sleep(300);
    // ↴
    await navigator.moveDown();
    let el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // ↴
    await navigator.moveDown();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // ⤴
    await navigator.moveUp();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // ⤴
    await navigator.moveUp();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // ⤴, the last item should be selected
    await navigator.moveUp();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();
  });

  it('Should use SHIFT + RightKey&LeftKey to toggle collapse/expand', async () => {
    const getSelector = (i: number) => `[data-testexpanded="expanded-${i}"`;
    const navigator = new Navigator(
      currentPage,
      OPEN_TABS.length - 1 + 1, // + 1 for the about tab from puppeteer
      INTERSECTION_RECENT_TABS_COMPLEMENT.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await sleep(300);

    // ↴
    await navigator.moveDownAndExpand();
    let el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // collapse
    await navigator.collapse();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeNull();

    // ↴
    await navigator.moveDownAndExpand();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // collapse
    await navigator.collapse();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeNull();

    // ⤴
    await navigator.moveUpAndExpand();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // collapse
    await navigator.collapse();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeNull();

    // ⤴
    await navigator.moveUpAndExpand();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // collapse
    await navigator.collapse();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeNull();

    // ⤴, the last item should be selected
    await navigator.moveUpAndExpand();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // collapse
    await navigator.collapse();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeNull();
  });

  it('Should use TAB to toggle collapse/expand', async () => {
    const getSelector = (i: number) => `[data-testexpanded="expanded-${i}"`;
    const navigator = new Navigator(
      currentPage,
      OPEN_TABS.length - 1 + 1, // + 1 for the about tab from puppeteer
      INTERSECTION_RECENT_TABS_COMPLEMENT.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await sleep(300);

    // ↴
    await navigator.moveDownAndExpand(true);
    let el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // collapse
    await navigator.toggleExpandCollapse();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeNull();

    // ↴
    await navigator.moveDownAndExpand(true);
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // collapse
    await navigator.toggleExpandCollapse();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeNull();

    // ⤴
    await navigator.moveUpAndExpand(true);
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // ⤴
    await navigator.moveUpAndExpand(true);
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // ⤴, the last item should be selected
    await navigator.moveUpAndExpand(true);
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeTruthy();

    // collapse
    await navigator.toggleExpandCollapse();
    el = await frame.$(getSelector(navigator.index));
    expect(el).toBeNull();
  });
});
