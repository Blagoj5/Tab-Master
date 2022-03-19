import closeExtension from './utils/closeTabMaster';
import {
  openExtensionMac,
  openExtensionNativeMac,
  openExtensionNativeWinOrUb,
  openExtensionWindowsOrUb,
} from './utils/openTabMaster';

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
