/* eslint-disable no-undef */
export type Actions =
{
  type: 'close-tab-master',
}
| {
  type: 'open-tab-master',
  tabs: {
		open: chrome.tabs.Tab[],
		recent: chrome.history.HistoryItem[],
	},
}
| {
  type: 'switch-tab',
  tabId: number,
}
| {
  type: 'open-tab',
  newTabUrl: string,
}
| {
  type: 'search-history',
  keyword: string,
}
| {
  type: 'send-recent-tabs',
  tabs: chrome.history.HistoryItem[],
};

export type CommonTab = {
	id: string;
	url: string;
	title: string;
	faviconUrl: string;
	action: 'open' | 'switch';
};
// type ChromeTabWithoutId = Omit<chrome.tabs.Tab, 'id'>;

export type OpenedTab = chrome.tabs.Tab & {
  virtualId: string;
}

export type RecentOpenedTab = chrome.history.HistoryItem & {
	faviconUrl: string;
};
