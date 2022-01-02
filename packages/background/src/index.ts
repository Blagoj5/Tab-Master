import { Actions } from '@tab-master/common/build/types';
import DomHelper from './DomHelper';
import TabMaster from './TabMaster';

const messageListener = (message: Actions, port: chrome.runtime.Port) => {
  switch (message.type) {
    case 'switch-tab':
      chrome.tabs.update(message.tabId, { active: true });
      break;
    case 'search-history':
      DomHelper.getRecentlyOpenedTabs(message.keyword)
        .then((recentTabs) => {
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

DomHelper.listenTabStatus();

const tabMaster = new TabMaster(messageListener);

tabMaster.init();
