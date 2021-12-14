/* eslint-disable no-undef */

/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/extensions
import { Actions } from '../common/index';

async function getCurrentTab() {
  const queryOptions: chrome.tabs.QueryInfo = {
    active: true,
    currentWindow: true,
    // title: '', // TODO: add in future
    // url: '', // TODO: add in future
  };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function connectToContentScript() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<chrome.runtime.Port>(async (res, reject) => {
    const currentTab = await getCurrentTab();

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

function getOpenedTabs() {
  return new Promise<chrome.tabs.Tab[]>((res) => {
    chrome.tabs.query({}, (tabs) => res(tabs));
  });
}

function getMsForADay(day: number) {
  return day * 24 * 60 * 60 * 1000;
}

function getRecentlyOpenedTabs(query: chrome.history.HistoryQuery = { text: '' }) {
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

const listenerHandler = (message: Actions, port: chrome.runtime.Port) => {
  switch (message.type) {
    case 'switch-tab':
      chrome.tabs.update(message.tabId, { active: true });
      break;
    case 'search-history':
      getRecentlyOpenedTabs({
        text: message.keyword,
      }).then((recentTabs) => {
        const payload: Actions = {
          type: 'send-recent-tabs',
          tabs: recentTabs,
        };
        port.postMessage(payload);
      });
      break;
    case 'open-tab':
      chrome.tabs.create({
        active: true,
        url: message.newTabUrl,
      });
      break;
    default:
      break;
  }
};

let port: chrome.runtime.Port;
chrome.commands.onCommand.addListener(async (command) => {
  // CMD + K
  if (command === 'open-tab-master') {
    const currentTab = await getCurrentTab();

    if (!currentTab.id) return;

    if (!port || !port.name.includes(String(currentTab.id))) {
      port = await connectToContentScript();
    }

    const openedTabs = await getOpenedTabs();
    const recentlyOpenedTabs = await getRecentlyOpenedTabs();

    const openMessage: Actions = {
      type: 'open-tab-master',
      tabs: {
        open: openedTabs,
        recent: recentlyOpenedTabs,
      },
    };

    port.postMessage(openMessage);

    // Listeners
    const listenerExists = port.onMessage.hasListener(listenerHandler);
    if (!listenerExists) {
      port.onMessage.addListener(listenerHandler);
    }
  }

  // TODO: I CAN't FIND ESCAPE FOR chrome.commands, even in chrome://extensions/shortcuts
  // Escape
  if (command === 'close-tab-master') {
    const message: Actions = {
      type: 'close-tab-master',
    };
    port.postMessage(message);
  }
});
