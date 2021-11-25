/* eslint-disable no-undef */

export type Actions =
{
  type: 'open-tab-master' | 'close-tab-master',
}
| {
  type: 'open-tabs',
  tabs: chrome.tabs.Tab[],
}
| {
  type: 'switch-tab',
  tabId: number,
}

// async function getCurrentTab() {
//   const queryOptions: chrome.tabs.QueryInfo = { active: true, currentWindow: true };
//   const [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }

chrome.runtime.onConnect.addListener((port) => {
  if ('name' in port && port.name === 'init') {
    // send initial data
    chrome.tabs.query({}, (tabs) => {
      const message: Actions = {
        type: 'open-tabs',
        tabs,
      };
      port.postMessage(message);
    });

    chrome.commands.onCommand.addListener((command) => {
      if (command === 'open-tab-master') {
        const message: Actions = {
          type: 'open-tab-master',
        };
        port.postMessage(message);
        return;
      }

      // TODO: I CAN't FIND ESCAPE FOR chrome.commands, even in chrome://extensions/shortcuts
      if (command === 'close-tab-master') {
        const message: Actions = {
          type: 'close-tab-master',
        };
        port.postMessage(message);
      }
    });

    port.onMessage.addListener((message: Actions) => {
      if (message.type === 'switch-tab') {
        console.log('message recieve here', port);
        chrome.tabs.update(message.tabId, { active: true });
      }
    });
  }
});
