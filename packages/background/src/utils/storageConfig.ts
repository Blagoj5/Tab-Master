import { defaultStorageConfig } from '@tab-master/common';
import { StorageConfig } from '@tab-master/common/build/types';

let settings: Partial<StorageConfig> | undefined;

export const loadSettings = async () => {
  if (!settings) {
    const persistedSettings: Partial<StorageConfig> = await browser.storage.sync.get();
    settings = persistedSettings;
  }

  return { ...defaultStorageConfig, ...settings };
};

export const storageChangeListener = async (changes: Record<string, any>, areaName: string) => {
  if (!settings) await loadSettings();
  if (areaName === 'sync') {
    const parsedObject = Object.keys(changes).reduce((obj, change) => ({
      ...obj,
      [change]: changes[change].newValue,
    }), {});
    settings = {
      ...settings,
      ...parsedObject,
    };
  }
};
