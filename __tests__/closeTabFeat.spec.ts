import Commands from './utils/commands';
import { test, expect } from './setup/extension-test';
import { openOpenedTabs } from './utils/openOpenedTabs';
import { openExtensionWindowsOrUb } from './utils/openTabMaster';

test.afterAll(({ context }) => {
  context.close();
});

test('Close Tab - CMD + X', async ({ page, context }) => {
  await openOpenedTabs(context, page);

  const initialPagesCount = context.pages().length;
  const currentPage = context
    .pages()
    .find((contextPage) => contextPage.url().includes('google'));

  if (!currentPage) throw new Error('No current page');

  await currentPage.bringToFront();
  await openExtensionWindowsOrUb(currentPage);
  await currentPage.waitForTimeout(500);
  const commands = new Commands(currentPage);
  await commands.closeTab();
  let deletedPageCount = context.pages().length;
  expect(deletedPageCount).toBe(initialPagesCount - 1);
  // TODO: Check if tab is deleted
  // const deletedPage = context
  //   .pages()
  //   .find((contextPage) => contextPage.url().includes('google'));
  await commands.closeTab();
  deletedPageCount = context.pages().length;
  expect(deletedPageCount).toBe(initialPagesCount - 2);
});
