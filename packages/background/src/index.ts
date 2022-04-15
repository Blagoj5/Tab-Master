import { Actions, isValidCommand } from '@tab-master/common/build/types';
import { closeTabMaster, openTabMaster } from './commands/openTabMaster';
import { Context } from './types';

import getRecentlyOpenedTabs from './utils/getRecentlyOpenedTabs';
import PortController from './utils/PortController';
import { loadSettings, storageChangeListener } from './utils/storageConfig';

const context: Context = {
  openedTabs: [],
  recentTabs: [],
  isOpen: false,
};

const onActionMessageListener = async (
  message: object,
  port: browser.runtime.Port,
  currentTab: Omit<browser.tabs.Tab, 'id'> & { id: number },
) => {
  const config = await loadSettings();

  // TODO: fix isActions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isActions = (data: any): data is Actions => Boolean(data);
  if (!isActions(message)) return;
  if (!isValidCommand(message.type)) throw new Error('Command is not valid');

  switch (message.type) {
    case 'init-extension': {
      const {
        tabs: { open, recent },
      } = await openTabMaster(currentTab, port);
      context.openedTabs = open;
      context.recentTabs = recent;
      break;
    }
    case 'close-tab-master':
      await closeTabMaster(port);
      context.isOpen = false;
      break;
    case 'switch-tab':
      browser.tabs.update(message.tabId, { active: true });
      context.isOpen = false;
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
      context.isOpen = false;
      break;
    case 'close-tab':
      browser.tabs.remove(message.tabId);
      break;
    default:
      break;
  }
};

const portController = new PortController(onActionMessageListener);

const onMessageListener = async (command: string) => {
  const config = await loadSettings();
  const port = await portController.getPort();
  const currentTab = await portController.getCurrentTab();

  //  if extension is disabled from settings, find a better way for this
  if (!config.extensionEnabled || !isValidCommand(command)) return;

  if (!port) {
    // TODO: setPopup as special modal if content script not loaded yet or not existing
    const createdTab = await browser.tabs.create({
      url: '', // TODO: causes small flickering
      active: true,
    });
    if (!createdTab.id) throw new Error('Created popup tab has no id');

    // for the new popup tab set the correct popup
    await browser.browserAction.setPopup({
      tabId: createdTab.id,
      popup: 'popup-modal/index.html',
    });

    const url = await browser.browserAction.getPopup({
      tabId: createdTab.id,
    });
    await browser.tabs.update(createdTab.id, { active: true, url });
    // TODO: if user selects something just do window.close on modal to turn it off
    return;
  }

  // CMD + K, CMD + SHIFT + K
  if (command === 'open-tab-master' && !context.isOpen) {
    const {
      tabs: { open, recent },
    } = await openTabMaster(currentTab, port);

    context.openedTabs = open;
    context.recentTabs = recent;
    context.isOpen = true;
  } else if (command === 'close-tab-master' || context.isOpen) {
    await closeTabMaster(port);
    context.isOpen = false;
  }
};

browser.storage.onChanged.addListener(storageChangeListener);
browser.commands.onCommand.addListener(onMessageListener);
