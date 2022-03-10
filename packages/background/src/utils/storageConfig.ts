import { defaultStorageConfig, localStorageKeys } from '@tab-master/common';
import { StorageConfig } from '@tab-master/common/build/types';

let settings: Partial<StorageConfig> | undefined;

const updateSettings = async (changedSettings: Partial<StorageConfig>) => {
  if (!settings) settings = defaultStorageConfig;
  settings = {
    ...settings,
    ...changedSettings,
  };

  // aftermath
  const currentDomain = (await browser.storage.local.get())[localStorageKeys.CURRENT_DOMAIN];
  const isBlackListed = settings.blackListedWebsites?.includes(currentDomain);
  if (isBlackListed) settings.extensionEnabled = false;
  else {
    const {
      extensionEnabled = defaultStorageConfig.extensionEnabled,
    } = await browser.storage.sync.get();
    settings.extensionEnabled = extensionEnabled;
  }
};

export const loadSettings = async () => {
  if (!settings) {
    const persistedSettings: Partial<StorageConfig> = await browser.storage.sync.get();
    await updateSettings(persistedSettings);
  }

  return settings ?? defaultStorageConfig;
};

export const storageChangeListener = async (changes: Record<string, any>, areaName: string) => {
  if (!settings) await loadSettings();
  if (areaName === 'sync') {
    const parsedChanges = Object.keys(changes).reduce((obj, change) => ({
      ...obj,
      [change]: changes[change].newValue,
    }), {} as Partial<StorageConfig>);

    updateSettings(parsedChanges);
  }

  // On CURRENT_DOMAIN change re-run update settings, with empty change so they are updated
  if (areaName === 'local') {
    updateSettings({});
  }
};
