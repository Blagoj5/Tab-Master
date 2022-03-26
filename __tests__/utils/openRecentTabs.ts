import { Browser, HTTPResponse, Page } from 'puppeteer';
import { recentTabs } from '../data';

export async function openRecentTabs() {
  const recentPages: Page[] = [];
  const recentPagesPromises: Promise<HTTPResponse>[] = [];
  for (const site of recentTabs) {
    const newPage = await (browser as unknown as Browser).newPage();
    recentPagesPromises.push(newPage.goto(site));
    recentPages.push(newPage);
  }
  await Promise.all(recentPagesPromises);
  await Promise.all(recentPages.map((page) => page.close()));
}
