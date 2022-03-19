import { RECENT_TABS } from './consts';

describe('Test functionality', () => {
  beforeAll(async () => {
    await jestPuppeteer.resetBrowser();
    for (const site of RECENT_TABS) {
      await page.goto(site);
    }
  });

  it('Should navigate trough recently opened tabs', async () => {});

  it('Should navigate trough opened tabs', async () => {});

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
