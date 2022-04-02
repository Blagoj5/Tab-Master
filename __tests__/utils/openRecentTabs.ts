import { BrowserContext, Response, Page } from '@playwright/test';
import { recentTabs } from '../data';

export async function openRecentTabs(browserContext: BrowserContext) {
  const recentPages: Page[] = [];
  const recentPagesPromises: Promise<Response>[] = [];
  for (const site of recentTabs) {
    const newPage = await browserContext.newPage();
    recentPagesPromises.push(
      newPage.goto(site, {
        timeout: 2500,
      }),
    );
    recentPages.push(newPage);
  }

  await Promise.allSettled(recentPagesPromises);
  await Promise.allSettled(recentPages.map((page) => page.close()));
}
