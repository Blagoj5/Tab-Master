import { validateFrame } from '../utils/validateFrame';
import closeExtension from '../utils/closeTabMaster';
import { Page } from 'puppeteer';

let currentPage: Page;
beforeEach(async () => {
  const { currentPage: currPage, frame } = await validateFrame();

  currentPage = currPage;
  global.currentPage = currentPage;
  global.frame = frame;
});

afterEach(async () => {
  await closeExtension(currentPage);
});
