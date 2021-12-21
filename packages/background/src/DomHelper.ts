import { getMsForADay } from './utils';

class DomHelper {
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

      const port = chrome.tabs.connect(currentTab.id, {
        name: `init-${currentTab.id}`,
      });

      res(port);
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
