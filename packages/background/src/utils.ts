/* eslint-disable import/prefer-default-export */

export function getMsForADay(day: number) {
  return day * 24 * 60 * 60 * 1000;
}
export async function checkTabLoaded(tabId: number) {
  return new Promise<boolean>((res) => {
    try {
      chrome.tabs.get(tabId, (tab) => {
        if (tab.status === 'complete') return res(true);
        return res(false);
      });
    } catch (error) {
      res(false);
    }
  });
}
