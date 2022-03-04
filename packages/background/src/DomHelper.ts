import { defaultStorageConfig } from '@tab-master/common';
import { StorageConfig } from '@tab-master/common/build/types';
import { checkTabLoaded, getMsForADay } from './utils';

type Tab = browser.tabs.Tab;
class DomHelper {
  currentTab: Omit<Tab, 'id'> & { id: number } | undefined;

  loadedTabs: { [tabId: string]: Tab } = {};

  activePorts: { [tabId: string ]: browser.runtime.Port } = {};

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

    browser.storage.onChanged.addListener(storageChangeListener);

    const persistedSettings: Partial<StorageConfig> = await browser.storage.sync.get();
    if (persistedSettings) this.setSettings(persistedSettings);
  }

  listenTabStatus(onOpenExtensionMessage: () => void) {
    const onTabClosed = (tabId: number) => {
      if (this.loadedTabs[tabId]) {
        delete this.loadedTabs[tabId];
      }
    };

    const messageListener = (message: unknown, sender: browser.runtime.MessageSender) => {
      if (typeof message === 'string') {
        switch (message) {
          case 'READY':
            if (sender.tab?.id) {
              this.loadedTabs[sender.tab.id] = sender.tab;
            }
            break;
          case 'open-tab-master':
          default:
            onOpenExtensionMessage();
            break;
        }
      }
    };

    if (!browser.runtime.onMessage.hasListener(messageListener)) {
      browser.runtime.onMessage.addListener(messageListener);
    }
    if (!browser.tabs.onRemoved.hasListener(onTabClosed)) {
      browser.tabs.onRemoved.addListener(onTabClosed);
    }
  }

  async getCurrentTab() {
    const queryOptions: browser.tabs._QueryQueryInfo = {
      active: true,
      currentWindow: true,
      // title: '',
      // url: '',
    };
    const [tab] = await browser.tabs.query(queryOptions);
    this.currentTab = {
      ...tab,
      id: tab.id ?? -1,
    };
    return tab;
  }

  async connectToContentScript() {
    // eslint-disable-next-line no-async-promise-executor
    const currentTab = await this.getCurrentTab();

    if (!currentTab.id) throw new Error('Current tab does not exist');

    let tabIsLoaded = Boolean(this.loadedTabs[currentTab.id]);
    if (!tabIsLoaded) tabIsLoaded = await checkTabLoaded(currentTab.id);
    if (tabIsLoaded) {
      const existingPort = this.activePorts[currentTab.id];
      if (existingPort) {
        return existingPort;
      }
      const port = browser.tabs.connect(currentTab.id, {
        name: `init-${currentTab.id}`,
      });
      port.onDisconnect.addListener(() => {
        delete this.activePorts[currentTab.id as number];
      });
      this.activePorts[currentTab.id] = port;
      return port;
    }
    // eslint-disable-next-line no-console
    console.warn('Content script on open tab is not loaded yet');
    return null;
    // reject(new Error('Content script on open tab is not loaded yet'));
  }

  async getOpenedTabs() {
    if (!this.settings.openTabsEnabled) return null;

    const tabs = await browser.tabs.query({
      currentWindow: true,
    });

    return tabs.filter(
      (item) => item.id !== this.currentTab?.id && item.url !== this.currentTab?.url,
    );
  }

  async getRecentlyOpenedTabs(text = '') {
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

    if (!this.settings.recentTabsEnabled) return null;

    const historyItems = await browser.history.search({
      text,
      endTime,
      startTime,
      maxResults,
    });

    const filteredHistoryItems = historyItems.filter(
      // TODO: in future maybe better filtering, by checking if the url points to same content
      // TODO: dont't show it twice (if it's cannoncial link)
      (item) => item.id !== String(this.currentTab?.id) && item.url !== this.currentTab?.url,
    );
    return filteredHistoryItems;
  }
}

export default DomHelper;
