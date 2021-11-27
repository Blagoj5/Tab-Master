/* eslint-disable no-undef */
export type Actions =
{
  type: 'close-tab-master',
}
| {
  type: 'open-tab-master',
  tabs: chrome.tabs.Tab[],
}
| {
  type: 'switch-tab',
  tabId: number,
}

// type ChromeTabWithoutId = Omit<chrome.tabs.Tab, 'id'>;

export type OpenedTab = chrome.tabs.Tab & {
  virtualId: string;
}
