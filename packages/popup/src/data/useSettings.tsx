import { defaultStorageConfig } from '@tab-master/common';
import { StorageConfig } from '@tab-master/common/build/types';
import { useEffect, useReducer } from 'react';

import setBrowserStorage from '../utils/setChromeStorage';

type Action = {
  type: 'toggleExtensionEnable';
}
| {
  type: 'toggleDescription';
}
| {
  type: 'toggleOpenTabsEnabled';
}
| {
  type: 'toggleRecentTabsEnabled';
}
| {
  type: 'setHistoryOptions';
  maxResults: number;
  from?: number;
  to?: number;
}
| {
  type: 'setView';
  view: StorageConfig['view']
}
| {
  type: 'toggleHistoryEnabled';
}
| {
  type: 'toggleAdvancedSearch';
}
| {
  type: 'addPageToBlackList';
  domain: string;
}
| {
  type: 'removePageFromBlackList';
  domain: string;
}
| {
  type: 'setState';
  state: Partial<StorageConfig>
}
| {
  type: 'setState';
  state: Partial<StorageConfig>
};

const reducer = (state: StorageConfig, action: Action): StorageConfig => {
  switch (action.type) {
    case 'setState': {
      return {
        ...state,
        ...action.state,
      };
    }

    case 'toggleDescription': {
      setBrowserStorage({ showDescription: !state.showDescription });
      return {
        ...state,
        showDescription: !state.showDescription,
      };
    }

    case 'toggleExtensionEnable': {
      const newExtensionEnabled = !state.extensionEnabled;
      setBrowserStorage({ extensionEnabled: newExtensionEnabled });
      return {
        ...state,
        extensionEnabled: newExtensionEnabled,
      };
    }

    case 'addPageToBlackList': {
      const uniqBlackListedWebsites = new Set(
        [...state.blackListedWebsites, action.domain],
      );
      const blackListedWebsites = Array.from(uniqBlackListedWebsites);
      setBrowserStorage({ blackListedWebsites });
      return {
        ...state,
        blackListedWebsites,
      };
    }

    case 'removePageFromBlackList': {
      const blackListedWebsites = state.blackListedWebsites.filter(
        (page) => page !== action.domain,
      );
      setBrowserStorage({ blackListedWebsites });
      return {
        ...state,
        blackListedWebsites,
      };
    }

    case 'toggleAdvancedSearch': {
      const advancedSearchEnabled = !state.advancedSearchEnabled;
      setBrowserStorage({ advancedSearchEnabled });
      return {
        ...state,
        advancedSearchEnabled,
      };
    }

    case 'toggleOpenTabsEnabled': {
      const checked = !state.openTabsEnabled;
      const newOpenTabsEnabled = !checked && !state.recentTabsEnabled
        ? state.openTabsEnabled // One switch must exist at all times, so use the old value
        : !state.openTabsEnabled;

      if (newOpenTabsEnabled === state.openTabsEnabled) return state;
      setBrowserStorage({ openTabsEnabled: newOpenTabsEnabled });

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
      setBrowserStorage({ recentTabsEnabled: newRecentTabsEnabled });

      return {
        ...state,
        recentTabsEnabled: newRecentTabsEnabled,
      };
    }

    case 'toggleHistoryEnabled': {
      const newHistoryEnabled = !state.historyEnabled;
      setBrowserStorage({ historyEnabled: newHistoryEnabled });
      return {
        ...state,
        historyEnabled: newHistoryEnabled,
      };
    }

    case 'setHistoryOptions': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type: _, ...newHistory } = action;
      setBrowserStorage({ history: newHistory });
      return {
        ...state,
        history: newHistory,
      };
    }

    case 'setView': {
      const { view } = action;
      setBrowserStorage({ view });
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
  const toggleAdvancedSearchEnabled = () => dispatch({ type: 'toggleAdvancedSearch' });
  const addPageToBlackList = (domain: string) => dispatch({ type: 'addPageToBlackList', domain });
  const removePageFromBlackList = (domain: string) => dispatch({ type: 'removePageFromBlackList', domain });
  const setHistoryOptions = (historyOptions: StorageConfig['history']) => dispatch({ type: 'setHistoryOptions', ...historyOptions });
  const toggleHistoryOptions = () => dispatch({ type: 'toggleHistoryEnabled' });
  const setView = (view: StorageConfig['view']) => dispatch({ type: 'setView', view });

  useEffect(() => {
    const setInitialSettings = async () => {
      if (!browser.storage?.sync) {
        // eslint-disable-next-line no-console
        console.warn('Chrome storage not available');
        return;
      }
      const persistedSettings: Partial<StorageConfig> = await browser.storage.sync.get();
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
    toggleAdvancedSearchEnabled,
    addPageToBlackList,
    removePageFromBlackList,
    toggleHistoryOptions,
    setHistoryOptions,
    setView,
  };
}
