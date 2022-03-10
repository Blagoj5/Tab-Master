import { StorageConfig } from "./types";

export const defaultStorageConfig: StorageConfig = {
	showDescription: false,
  extensionEnabled: true,
  openTabsEnabled: true,
  recentTabsEnabled: true,
	historyEnabled: false,
	advancedSearchEnabled: true,
	blackListedWebsites: [],
  history: {
		maxResults: 20,
	},
  windowSwitchEnabled: false,
  view: 'minimal',
};

export const localStorageKeys = {
	CURRENT_DOMAIN: 'CURRENT_DOMAIN',
};

export default { defaultStorageConfig, localStorageKeys };
