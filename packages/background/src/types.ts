export type Context = {
  recentTabs: browser.history.HistoryItem[];
  openedTabs: browser.tabs.Tab[];
  isOpen: boolean;
};

export const isCurrentTab = (
  data: browser.tabs.Tab,
): data is Omit<browser.tabs.Tab, 'id'> & { id: number } =>
  Boolean(data && !!data.id);
