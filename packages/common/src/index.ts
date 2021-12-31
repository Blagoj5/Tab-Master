import { StorageConfig } from "./types";

export const defaultStorageConfig: StorageConfig = {
  extensionEnabled: true,
  openTabsEnabled: true,
  recentTabsEnabled: true,
  history: {
    from: -1,
    to: -1,
    maxResults: 20,
  },
  windowSwitchEnabled: false,
  view: 'standard',
};

export default { defaultStorageConfig };
