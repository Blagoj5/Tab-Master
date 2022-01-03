import { StorageConfig } from "./types";

export const defaultStorageConfig: StorageConfig = {
	showDescription: false,
  extensionEnabled: true,
  openTabsEnabled: true,
  recentTabsEnabled: true,
	historyEnabled: false,
  history: {
		maxResults: 20,
	},
  windowSwitchEnabled: false,
  view: 'standard',
};

export default { defaultStorageConfig };
