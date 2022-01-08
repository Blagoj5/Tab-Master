import { defaultStorageConfig } from '@tab-master/common';
import { StorageConfig } from '@tab-master/common/build/types';
import { checkTabLoaded, getMsForADay } from './utils';

class DomHelper {
  currentTab: Omit<chrome.tabs.Tab, 'id'> & { id: number } | undefined;

  loadedTabs: { [tabId: string]: chrome.tabs.Tab } = {};

  activePorts: { [tabId: string ]: chrome.runtime.Port } = {};

  settings: StorageConfig = defaultStorageConfig;

  setSettings(newSettings: Partial<StorageConfig>) {
    this.settings = {
      ...this.settings,
      ...newSettings,
    };
  }

  async loadSettings(onOptionsChanged: () => void) {
    const storageChangeListener = (changes: Record<string, any>, areaName: string) => {
      if (areaName === 'sync') {
        const parsedObject = Object.keys(changes).reduce((obj, change) => ({
          ...obj,
          [change]: changes[change].newValue,
        }), {});
        this.setSettings(parsedObject);
        onOptionsChanged();
      }
    };

    chrome.storage.onChanged.addListener(storageChangeListener);

    const persistedSettings: Partial<StorageConfig> = await chrome.storage.sync.get(null);
    if (persistedSettings) this.setSettings(persistedSettings);
  }

  listenTabStatus(onOpenExtensionMessage: () => void) {
    const onTabClosed = (tabId: number) => {
      if (this.loadedTabs[tabId]) {
        delete this.loadedTabs[tabId];
      }
    };

    const onContentScriptLoaded = (message: unknown, sender: chrome.runtime.MessageSender) => {
      if (typeof message === 'string' && message === 'READY') {
        if (sender.tab?.id) {
          this.loadedTabs[sender.tab.id] = sender.tab;
        }
      }
      if (typeof message === 'string' && message === 'open-tab-master') {
        onOpenExtensionMessage();
      }
    };

    if (!chrome.runtime.onMessage.hasListener(onContentScriptLoaded)) {
      chrome.runtime.onMessage.addListener(onContentScriptLoaded);
    }
    if (!chrome.tabs.onRemoved.hasListener(onTabClosed)) {
      chrome.tabs.onRemoved.addListener(onTabClosed);
    }
  }

  async getCurrentTab() {
    const queryOptions: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
      // title: '',
      // url: '',
    };
    const [tab] = await chrome.tabs.query(queryOptions);
    this.currentTab = {
      ...tab,
      id: tab.id ?? -1,
    };
    return tab;
  }

  connectToContentScript() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<chrome.runtime.Port>(async (res, reject) => {
      const currentTab = await this.getCurrentTab();

      if (!currentTab.id) {
        reject(new Error('Current tab does not exist'));
        return;
      }

      let tabIsLoaded = Boolean(this.loadedTabs[currentTab.id]);
      if (!tabIsLoaded) tabIsLoaded = await checkTabLoaded(currentTab.id);
      if (tabIsLoaded) {
        const existingPort = this.activePorts[currentTab.id];
        if (existingPort) {
          res(existingPort);
        } else {
          const port = chrome.tabs.connect(currentTab.id, {
            name: `init-${currentTab.id}`,
          });
          port.onDisconnect.addListener(() => {
            delete this.activePorts[currentTab.id as number];
          });
          this.activePorts[currentTab.id] = port;
          res(port);
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('Content script on open tab is not loaded yet');
        // reject(new Error('Content script on open tab is not loaded yet'));
      }
    });
  }

  getOpenedTabs() {
    return new Promise<chrome.tabs.Tab[] | null>((res) => {
      if (!this.settings.openTabsEnabled) {
        res(null);
        return;
      }
      chrome.tabs.query({ currentWindow: true }, (tabs) => res(tabs.filter(
        (item) => item.id !== this.currentTab?.id && item.url !== this.currentTab?.url,
      )));
    });
  }

  getRecentlyOpenedTabs(text = '') {
    const historyOptionsEnabled = this.settings.historyEnabled;
    const endTime = historyOptionsEnabled && this.settings.history.to
      ? this.settings.history.to
      : Date.now();
    const startTime = historyOptionsEnabled && this.settings.history.from
      ? this.settings.history.from
      : Date.now() - getMsForADay(50);
    const maxResults = historyOptionsEnabled
      ? this.settings.history.maxResults
      : 20;
    return new Promise<chrome.history.HistoryItem[] | null>((res) => {
      if (!this.settings.recentTabsEnabled) {
        res(null);
        return;
      }

      chrome.history.search({
        text,
        endTime,
        startTime,
        maxResults,
      }, (historyItems) => {
        const filteredHistoryItems = historyItems.filter(
          // TODO: in future maybe better filtering, by checking if the url points to same content
          // TODO: dont't show it twice (if it's cannoncial link)
          (item) => item.id !== String(this.currentTab?.id) && item.url !== this.currentTab?.url,
        );
        return res(filteredHistoryItems);
      });
    });
  }
}

export default DomHelper;
