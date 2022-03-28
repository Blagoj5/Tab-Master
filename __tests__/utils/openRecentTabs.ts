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

  // self canceling promise
  await (async () => {
    return new Promise<void>((res) => {
      // Wait for 2.5s at max, then close pages
      setTimeout(() => res(), 2500);
      // if pages resolve before 2.5s
      Promise.all(recentPagesPromises).then(() => res());
    });
  })();

  await Promise.all(recentPages.map((page) => page.close()));
}
