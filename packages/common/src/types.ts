/* eslint-disable no-undef */
export type Actions =
  | {
      type: 'init-extension';
    }
  | {
      type: 'close-tab-master';
    }
  | {
      type: 'open-tab-master' | 'current-state';
      tabs: {
        open: browser.tabs.Tab[] | null;
        recent: browser.history.HistoryItem[] | null;
      };
    }
  | {
      type: 'switch-tab';
      tabId: number;
    }
  | {
      type: 'open-tab';
      newTabUrl: string;
    }
  | {
      type: 'close-tab';
      tabId: number;
    }
  | {
      type: 'search-history';
      keyword: string;
    }
  | {
      type: 'send-recent-tabs';
      tabs: browser.history.HistoryItem[] | null;
    };

export type Command = Actions['type'];
const validCommands = [
  'close-tab',
  'close-tab-master',
  'current-state',
  'open-tab',
  'open-tab-master',
  'search-history',
  'send-recent-tabs',
  'switch-tab',
  'init-extension',
] as const;
export const isValidCommand = (data: any): data is Command =>
  Boolean(data && validCommands.includes(data));

export type CommonTab = {
  id: string;
  url: string;
  title: string;
  faviconUrl: string;
  action: 'open' | 'switch';
  visitCount?: number;
};

export type OpenedTab = browser.tabs.Tab & {
  virtualId: string;
};

export type RecentOpenedTab = browser.history.HistoryItem & {
  faviconUrl: string;
};

export type StorageConfig = {
  showDescription: boolean;
  extensionEnabled: boolean;
  openTabsEnabled: boolean;
  recentTabsEnabled: boolean;
  historyEnabled: boolean;
  advancedSearchEnabled: boolean;
  blackListedWebsites: string[];
  history: {
    from?: number;
    to?: number;
    maxResults: number;
  };
  windowSwitchEnabled: boolean;
  view: 'minimal' | 'standard';
};
