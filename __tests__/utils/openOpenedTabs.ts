import { HTTPResponse, Page } from 'puppeteer';
import { openTabs } from '../data';
import sleep from './sleep';

export async function openOpenedTabs() {
  const openedPages: Page[] = [page];
  const openPagesPromises: Promise<HTTPResponse>[] = [];
  for (const site of openTabs) {
    const newPage = await browser.newPage();
    openPagesPromises.push(newPage.goto(site));
    openedPages.push(newPage);
    await sleep(100);
  }
  await Promise.allSettled(openPagesPromises);
}
