import { defaultStorageConfig } from '@tab-master/common';
import { StorageConfig } from '@tab-master/common/build/types';
import { useEffect, useReducer } from 'react';
import setChromeStorage from '../utils/setChromeStorage';

type Action = {
  type: 'toggleExtensionEnable';
} | {
  type: 'toggleDescription';
} | {
  type: 'toggleOpenTabsEnabled';
} | {
  type: 'toggleRecentTabsEnabled';
} | {
  type: 'setHistoryOptions';
  maxResults: number;
  from?: number;
  to?: number;
} | {
  type: 'setView';
  view: StorageConfig['view']
} | {
  type: 'toggleHistoryEnabled';
} | {
  type: 'setState';
  state: Partial<StorageConfig>
}

const reducer = (state: StorageConfig, action: Action): StorageConfig => {
  switch (action.type) {
    case 'setState': {
      return {
        ...state,
        ...action.state,
      };
    }

    case 'toggleDescription': {
      setChromeStorage({ showDescription: !state.showDescription });
      return {
        ...state,
        showDescription: !state.showDescription,
      };
    }

    case 'toggleExtensionEnable': {
      const newExtensionEnabled = !state.extensionEnabled;
      setChromeStorage({ extensionEnabled: newExtensionEnabled });
      return {
        ...state,
        extensionEnabled: newExtensionEnabled,
      };
    }

    case 'toggleOpenTabsEnabled': {
      const checked = !state.openTabsEnabled;
      const newOpenTabsEnabled = !checked && !state.recentTabsEnabled
        ? state.openTabsEnabled // One switch must exist at all times, so use the old value
        : !state.openTabsEnabled;

      if (newOpenTabsEnabled === state.openTabsEnabled) return state;
      setChromeStorage({ openTabsEnabled: newOpenTabsEnabled });

      return {
        ...state,
        openTabsEnabled: newOpenTabsEnabled,
      };
    }

    case 'toggleRecentTabsEnabled': {
      const checked = !state.recentTabsEnabled;
      const newRecentTabsEnabled = !checked && !state.openTabsEnabled
        ? state.recentTabsEnabled // One switch must exist at all times, so use the old value
        : !state.recentTabsEnabled;

      if (newRecentTabsEnabled === state.recentTabsEnabled) return state;
      setChromeStorage({ recentTabsEnabled: newRecentTabsEnabled });

      return {
        ...state,
        recentTabsEnabled: newRecentTabsEnabled,
      };
    }

    case 'toggleHistoryEnabled': {
      const newHistoryEnabled = !state.historyEnabled;
      setChromeStorage({ historyEnabled: newHistoryEnabled });
      return {
        ...state,
        historyEnabled: newHistoryEnabled,
      };
    }

    case 'setHistoryOptions': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type: _, ...newHistory } = action;
      setChromeStorage({ history: newHistory });
      return {
        ...state,
        history: newHistory,
      };
    }

    case 'setView': {
      const { view } = action;
      setChromeStorage({ view });
      return {
        ...state,
        view,
      };
    }

    default:
      return state;
  }
};

export default function useSettings() {
  const [settings, dispatch] = useReducer(reducer, defaultStorageConfig);

  const toggleDescription = () => dispatch({ type: 'toggleDescription' });
  const toggleExtensionEnabled = () => dispatch({ type: 'toggleExtensionEnable' });
  const toggleOpenTabsEnabled = () => dispatch({ type: 'toggleOpenTabsEnabled' });
  const toggleRecentTabsEnabled = () => dispatch({ type: 'toggleRecentTabsEnabled' });
  const setHistoryOptions = (historyOptions: StorageConfig['history']) => dispatch({ type: 'setHistoryOptions', ...historyOptions });
  const toggleHistoryOptions = () => dispatch({ type: 'toggleHistoryEnabled' });
  const setView = (view: StorageConfig['view']) => dispatch({ type: 'setView', view });

  useEffect(() => {
    const setInitialSettings = async () => {
      if (!chrome.storage?.sync) {
        // eslint-disable-next-line no-console
        console.warn('Chrome storage not available');
        return;
      }
      const persistedSettings: Partial<StorageConfig> = await chrome.storage.sync.get(null);
      dispatch({
        type: 'setState',
        state: persistedSettings,
      });
    };
    setInitialSettings();
  }, []);

  return {
    settings,
    toggleDescription,
    toggleExtensionEnabled,
    toggleOpenTabsEnabled,
    toggleRecentTabsEnabled,
    toggleHistoryOptions,
    setHistoryOptions,
    setView,
  };
}
