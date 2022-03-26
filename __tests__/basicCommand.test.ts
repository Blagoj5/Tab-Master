import { intersectionRecentTabsComplement, openTabs } from './data';
import closeExtension from './utils/closeTabMaster';
import {
  openExtensionMac,
  openExtensionNativeMac,
  openExtensionNativeWinOrUb,
  openExtensionWindowsOrUb,
} from './utils/openTabMaster';
import sleep from './utils/sleep';
import Navigator from './utils/Navigator';
import { openRecentTabs } from './utils/openRecentTabs';
import { openOpenedTabs } from './utils/openOpenedTabs';

describe('Test open commands - MacOS', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  it('Should toggle - CMD + K', async () => {
    // TOGGLE
    await openExtensionMac(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    const elementHandle = await page.waitForSelector('iframe');
    const frame = await elementHandle?.contentFrame();
    let el = await frame?.waitForSelector(selector);

    expect(el).toBeTruthy();

    await openExtensionMac(); // CLOSE
    el = await frame?.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - CMD + K then Escape', async () => {
    // TOGGLE
    await openExtensionMac(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    let el = await frame?.waitForSelector(selector);

    expect(el).toBeTruthy();

    await closeExtension(); // CLOSE
    el = await frame?.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - CMD + Shift + K then Escape', async () => {
    // TOGGLE
    await openExtensionNativeMac(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    let el = await frame?.waitForSelector(selector);

    expect(el).toBeTruthy();

    await closeExtension(); // CLOSE
    el = await frame?.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - CMD + Shift + K then CMD + K', async () => {
    // TOGGLE
    await openExtensionNativeMac(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    let el = await frame?.waitForSelector(selector);

    expect(el).toBeTruthy();

    await openExtensionMac(); // CLOSE
    el = await frame?.$(selector);
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
    await openExtensionWindowsOrUb(currentPage); // OPEN
    const selector = '*[data-testid="open-modal"]';

    let el = await frame?.waitForSelector(selector);

    expect(el).toBeTruthy();

    await openExtensionWindowsOrUb(); // CLOSE
    el = await frame?.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - Control + K then Escape', async () => {
    // TOGGLE
    await openExtensionWindowsOrUb(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    let el = await frame?.waitForSelector(selector);

    expect(el).toBeTruthy();

    await closeExtension(); // CLOSE
    el = await frame?.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - Control + Shift + K then Escape', async () => {
    // TOGGLE
    await openExtensionNativeWinOrUb(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    let el = await frame?.waitForSelector(selector);

    expect(el).toBeTruthy();

    await closeExtension(); // CLOSE
    el = await frame?.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });

  it('Should open then close - Control + Shift + K then Control + K', async () => {
    // TOGGLE
    await openExtensionNativeWinOrUb(); // OPEN
    const selector = '*[data-testid="open-modal"]';

    let el = await frame?.waitForSelector(selector);

    expect(el).toBeTruthy();

    await openExtensionWindowsOrUb(); // CLOSE
    el = await frame?.$(selector);
    expect(el).toBeNull();

    await expect(page.title()).resolves.toMatch('Google');
  });
});

describe('Test TAB iteration', () => {
  beforeAll(async () => {
    await jestPuppeteer.resetBrowser();
    await openRecentTabs();
    await openOpenedTabs();
  });

  afterEach(async () => {
    await closeExtension(currentPage);
  });

  it('Should use Arrow Keys to navigate trough tabs', async () => {
    const getSelector = (i: number) => `[data-testselected="selected-${i}"]`;
    const navigator = new Navigator(
      currentPage,
      openTabs.length - 1 + 1, // + 1 for the about tab from puppeteer
      intersectionRecentTabsComplement.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle?.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await sleep(300);

    const moveDown = async () => {
      await navigator.moveDown();
      const el = await frame?.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const moveUp = async () => {
      await navigator.moveUp();
      const el = await frame?.$(getSelector(navigator.index));
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
    const getSelector = (i: number) => `[data-testexpanded="expanded-${i}"]`;
    const navigator = new Navigator(
      currentPage,
      openTabs.length - 1 + 1, // + 1 for the about tab from puppeteer
      intersectionRecentTabsComplement.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle?.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await sleep(300);

    const moveDown = async () => {
      await navigator.moveDownAndExpand();
      const el = await frame?.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const moveUp = async () => {
      await navigator.moveUpAndExpand();
      const el = await frame?.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const collapse = async () => {
      await navigator.collapse();
      const el = await frame?.$(getSelector(navigator.index));
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
    const getSelector = (i: number) => `[data-testexpanded="expanded-${i}"]`;
    const navigator = new Navigator(
      currentPage,
      openTabs.length - 1 + 1, // + 1 for the about tab from puppeteer
      intersectionRecentTabsComplement.length - 1, // + 1 for the about tab from puppeteer
    );

    const elementHandle = await currentPage.waitForSelector('iframe');
    const frame = await elementHandle?.contentFrame();

    // TOGGLE
    await openExtensionWindowsOrUb(currentPage); // OPEN
    await sleep(300);

    const moveDown = async () => {
      await navigator.moveDownAndExpand(true);
      const el = await frame?.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const moveUp = async () => {
      await navigator.moveUpAndExpand(true);
      const el = await frame?.$(getSelector(navigator.index));
      expect(el).toBeTruthy();
    };

    const toggleCollapse = async () => {
      await navigator.toggleExpandCollapse();
      const el = await frame?.$(getSelector(navigator.index));
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
