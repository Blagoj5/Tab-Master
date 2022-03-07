/* eslint-disable import/prefer-default-export */

export function getMsForNDay(day: number) {
  return day * 24 * 60 * 60 * 1000;
}

export async function checkTabLoaded(tabId: number) {
  const tab = await browser.tabs.get(tabId);

  if (tab.status === 'complete') return true;

  return false;
}
