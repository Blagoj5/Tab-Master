import { getActivePage } from './getActivePage';

export async function validateFrame() {
  const currentPage = await getActivePage();
  const elementHandle = await currentPage.waitForSelector('iframe');
  const frame = await elementHandle.contentFrame();
  return { currentPage, frame };
}
