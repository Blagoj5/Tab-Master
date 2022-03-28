import { Actions } from '@tab-master/common/build/types';
import { Context } from './types';

import connectToTabContentScript from './utils/connectToTabContentScript';
import getCurrentTab from './utils/getCurrentTab';
import getRecentlyOpenedTabs from './utils/getRecentlyOpenedTabs';
import getOpenTabMasterPayload from './utils/openTabMaster';
import { loadSettings, storageChangeListener } from './utils/storageConfig';

const context: Context = {
  openedTabs: [],
  recentTabs: [],
};

const onActionMessageListener = async (message: object) => {
  const currentTab = await getCurrentTab();
  const config = await loadSettings();

  if (!currentTab.id) throw new Error('Current tab does not exist');

  const port = await connectToTabContentScript(currentTab.id);

  if (!port) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isActions = (data: any): data is Actions => Boolean(data);
  if (!isActions(message)) return;
  if (!currentTab?.id) throw new Error('No current tab');

  switch (message.type) {
    case 'switch-tab':
      browser.tabs.update(message.tabId, { active: true });
      break;
    case 'search-history': {
      if (!config.recentTabsEnabled) return;
      const recentTabs = await getRecentlyOpenedTabs(
        {
          currentTabId: currentTab.id,
          currentTabUrl: currentTab?.url,
          openedTabs: context.openedTabs,
        },
        message.keyword,
      );
      context.recentTabs = recentTabs;
      const payload: Actions = {
        type: 'send-recent-tabs',
        tabs: recentTabs,
      };
      port?.postMessage(payload);
      break;
    }
    case 'open-tab':
      browser.tabs.create({
        active: true,
        url: message.newTabUrl,
      });
      break;
    case 'close-tab':
      browser.tabs.remove(message.tabId);
      break;
    default:
      break;
  }

  if (port.onMessage.hasListener(onActionMessageListener)) {
    port.onMessage.addListener(onActionMessageListener);
  }
};

const onMessageListener = async (command: string) => {
  const config = await loadSettings();
  const currentTab = await getCurrentTab();

  if (!currentTab.id) throw new Error('Current tab does not exist');

  const port = await connectToTabContentScript(currentTab.id);

  if (!port) return;

  //  if extension is disabled from settings, find a better way for this
  if (!config.extensionEnabled || !currentTab?.id) return;

  // CMD + K
  if (command === 'open-tab-master') {
    const message = await getOpenTabMasterPayload(
      'open-tab-master',
      currentTab?.id,
      currentTab?.url,
    );
    context.openedTabs = message.tabs.open;
    context.recentTabs = message.tabs.recent;
    port.postMessage(message);
  }

  // Escape
  if (command === 'close-tab-master') {
    const message = {
      type: 'close-tab-master',
    };
    port.postMessage(message);
  }

  // console.log('aaaa', port.onMessage.hasListener(onActionMessageListener));
  if (!port.onMessage.hasListener(onActionMessageListener)) {
    // console.log('add listener', port);
    port.onMessage.addListener(onActionMessageListener);
  }
};

browser.storage.onChanged.addListener(storageChangeListener);
browser.commands.onCommand.addListener(onMessageListener);
browser.runtime.onMessage.addListener(onMessageListener);
