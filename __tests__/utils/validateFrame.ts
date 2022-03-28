import { getActivePage } from './getActivePage';

export async function validateFrame() {
  const currentPage = await getActivePage();
  const elementHandle = await currentPage.waitForSelector('iframe#tab-master');
  const frame = await elementHandle?.contentFrame();

  if (!frame) throw new Error('No frame');

  return { currentPage, frame };
}
