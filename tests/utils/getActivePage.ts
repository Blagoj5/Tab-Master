import { BrowserContext, Page } from '@playwright/test';
import sleep from './sleep';

export async function getActivePage(argBrowser: BrowserContext): Promise<Page> {
  for (let index = 0; index < 10; index++) {
    const pages = argBrowser.pages();
    console.log(
      'LOG -> file: getActivePage.ts -> line 7 -> getActivePage -> pages',
      pages.map((page) => page.url()),
    );
    const arr: Page[] = [];
    for (const p of pages) {
      if (
        await p.evaluate(() => {
          return document.visibilityState == 'visible';
        })
      ) {
        arr.push(p);
      }
    }
    if (arr.length == 1) {
      await arr[0].bringToFront(); // TODO: remove bring to front from other places
      return arr[0];
    }
    await sleep(500);
  }
  throw 'Unable to get active page';
}
