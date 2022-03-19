import { Browser, Page } from 'puppeteer';
import sleep from './sleep';

export async function getActivePage(browser: Browser): Promise<Page> {
  for (let index = 0; index < 10; index++) {
    const pages = await browser.pages();
    const arr = [];
    for (const p of pages) {
      if (
        await p.evaluate(() => {
          return document.visibilityState == 'visible';
        })
      ) {
        arr.push(p);
      }
    }
    if (arr.length == 1) return arr[0];
    await sleep(500);
  }
  throw 'Unable to get active page';
}
