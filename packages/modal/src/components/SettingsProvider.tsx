import { defaultStorageConfig } from '@tab-master/common';
import { StorageConfig } from '@tab-master/common/build/types';
import {
  createContext, ReactNode, useContext, useEffect, useState,
} from 'react';
import useStorageSync from '../hooks/useStorageSync';

const SettingsContext = createContext<StorageConfig | undefined>(undefined);

function SettingsProvider({ children }: {children: ReactNode}) {
  const [settings, setSettings] = useState<StorageConfig>(defaultStorageConfig);
  useStorageSync();

  const setSettingsObject = (update: Partial<StorageConfig>) => {
    setSettings({
      ...settings,
      ...update,
    });
  };

  useEffect(() => {
    if (!chrome?.storage?.sync) {
      // eslint-disable-next-line no-console
      console.warn('Chrome storage sync is not available');
      return undefined;
    }

    // Init the listener
    const storageChangeListener = (changes: object, areaName: string) => {
      if (areaName === 'sync') {
        const parsedObject = Object.keys(changes).reduce((obj, change) => ({
          ...obj,
          [change]: changes[change].newValue,
        }), {});
        setSettingsObject(parsedObject);
      }
    };
    browser.storage.onChanged.addListener(storageChangeListener);

    const setInitialSettings = async () => {
      const persistedSettings: Partial<StorageConfig> = await browser.storage.sync.get();
      if (persistedSettings) setSettingsObject(persistedSettings);
    };
    setInitialSettings();

    // Umount the listener
    return () => {
      browser.storage.onChanged.removeListener(storageChangeListener);
    };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettingsContext = () => {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error('You must wrap the parent component with SettingsProvider');
  }

  return settings;
};

export default SettingsProvider;
