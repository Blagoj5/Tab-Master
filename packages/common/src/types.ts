/* eslint-disable no-undef */
export type Actions =
{
  type: 'close-tab-master',
}
| {
  type: 'open-tab-master',
  tabs: {
    open: chrome.tabs.Tab[] | null,
    recent: chrome.history.HistoryItem[] | null,
  },
}
| {
  type: 'current-state',
  tabs: {
    open: chrome.tabs.Tab[] | null,
    recent: chrome.history.HistoryItem[] | null,
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
  tabs: chrome.history.HistoryItem[] | null,
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

export type StorageConfig = {
	extensionEnabled: boolean;
	openTabsEnabled: boolean;
	recentTabsEnabled: boolean;
	historyEnabled: boolean;
	history: {
		from?: number;
		to?: number;
		maxResults: number;
	};
	windowSwitchEnabled: boolean;
	view: 'minimal' | 'standard';
};