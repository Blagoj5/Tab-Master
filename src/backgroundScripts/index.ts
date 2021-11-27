/* eslint-disable no-undef */

export type Actions =
{
  type: 'close-tab-master',
}
| {
  type: 'open-tab-master',
  tabs: chrome.tabs.Tab[],
}
| {
  type: 'switch-tab',
  tabId: number,
}

async function getCurrentTab() {
  const queryOptions: chrome.tabs.QueryInfo = { active: true, currentWindow: true };
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
// IDEA:
// - Open connection initially on first cmd + k
// - If cmd + k clicked and connection exists just send message (open-tab-mater)
// - Use connection to communicate (tabs.connect)

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

    const openMessage: Actions = {
      type: 'open-tab-master',
      tabs: openedTabs,
    };

    port.postMessage(openMessage);

    // Listeners
    port.onMessage.addListener((message: Actions) => {
      if (message.type === 'switch-tab') {
        chrome.tabs.update(message.tabId, { active: true });
      }
    });
    return;
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
