export type Context = {
  recentTabs: browser.history.HistoryItem[];
  openedTabs: browser.tabs.Tab[];
  isOpen: boolean;
};
