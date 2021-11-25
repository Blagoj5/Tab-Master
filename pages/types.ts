/* eslint-disable no-undef */

export type Actions =
{
  type: 'open-tab-master' | 'close-tab-master',
}
| {
  type: 'open-tabs',
  tabs: chrome.tabs.Tab[],
} | {
  type: 'switch-tab',
  tabId: number,
}

// type ChromeTabWithoutId = Omit<chrome.tabs.Tab, 'id'>;

export type OpenedTab = chrome.tabs.Tab & {
  virtualId: string;
}
