import { Response, Page, BrowserContext } from '@playwright/test';
import { openTabs } from '../data';
import sleep from './sleep';

export async function openOpenedTabs(
  browserContext: BrowserContext,
  blankPage: Page,
) {
  const openedPages: Page[] = [blankPage];
  const openPagesPromises: Promise<Response>[] = [];
  for (const site of openTabs) {
    const newPage = await browserContext.newPage();
    openPagesPromises.push(newPage.goto(site));
    openedPages.push(newPage);
    await sleep(100);
  }
  await Promise.allSettled(openPagesPromises);
  return openedPages;
}
