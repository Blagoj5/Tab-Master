import { getMsForADay } from './utils';

class DomHelper {
  static loadedTabs: { [tabId: string]: boolean } = {};

  static activePorts: { [tabId: string ]: chrome.runtime.Port } = {};

  static listenTabStatus() {
    const onTabClosed = (tabId: number) => {
      if (this.loadedTabs[tabId]) {
        delete this.loadedTabs[tabId];
      }
    };

    const onContentScriptLoaded = (status: unknown, sender: chrome.runtime.MessageSender) => {
      if (typeof status === 'string' && status === 'READY') {
        if (sender.tab?.id) {
          this.loadedTabs[sender.tab.id] = true;
        }
      }
    };

    if (!chrome.runtime.onMessage.hasListener(onContentScriptLoaded)) {
      chrome.runtime.onMessage.addListener(onContentScriptLoaded);
      chrome.tabs.onRemoved.addListener(onTabClosed);
    }
  }

  static async getCurrentTab() {
    const queryOptions: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
      // title: '', // TODO: add in future
      // url: '', // TODO: add in future
    };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  static connectToContentScript() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<chrome.runtime.Port>(async (res, reject) => {
      const currentTab = await this.getCurrentTab();

      if (!currentTab.id) {
        reject(new Error('Current tab does not exist'));
        return;
      }

      if (this.loadedTabs[currentTab.id]) {
        const existingPort = this.activePorts[currentTab.id];
        if (existingPort) {
          res(existingPort);
        } else {
          const port = chrome.tabs.connect(currentTab.id, {
            name: `init-${currentTab.id}`,
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

  static getOpenedTabs() {
    return new Promise<chrome.tabs.Tab[]>((res) => {
      chrome.tabs.query({ currentWindow: true }, (tabs) => res(tabs));
    });
  }

  static getRecentlyOpenedTabs(query: chrome.history.HistoryQuery = { text: '' }) {
    const {
      text = '',
      endTime = Date.now(),
      startTime = Date.now() - getMsForADay(50),
      maxResults = 20,
    } = query;
    return new Promise<chrome.history.HistoryItem[]>((res) => {
      chrome.history.search({
        text,
        endTime,
        startTime,
        maxResults,
      }, (historyItems) => (
        res(historyItems)
      ));
    });
  }
}

export default DomHelper;
