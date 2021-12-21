import { Actions } from '@tab-master/common';
import DomHelper from './DomHelper';

class TabMaster {
   private currentTabId: number = -1;

   // eslint-disable-next-line no-unused-vars
   private onMessageListener: (message: Actions, port: chrome.runtime.Port) => void;

   constructor(onMessageListener: TabMaster['onMessageListener']) {
     this.onMessageListener = onMessageListener;
   }

   async init() {
     chrome.commands.onCommand.addListener(async (command) => {
       // CMD + K
       if (command === 'open-tab-master') {
         const currentTab = await DomHelper.getCurrentTab();
         if (!currentTab.id) return;
         this.currentTabId = currentTab.id;

         await DomHelper.connectToContentScript();

         const port = DomHelper.activePorts[currentTab.id];
         if (!port) return;

         const openedTabs = await DomHelper.getOpenedTabs();
         const recentlyOpenedTabs = await DomHelper.getRecentlyOpenedTabs();

         const openMessage: Actions = {
           type: 'open-tab-master',
           tabs: {
             open: openedTabs,
             recent: recentlyOpenedTabs,
           },
         };

         port.postMessage(openMessage);

         // Listeners
         //  this.onDisconnect();
         this.onMessage();
       }

       // TODO: I CAN't FIND ESCAPE FOR chrome.commands, even in chrome://extensions/shortcuts
       // Escape
       if (command === 'close-tab-master') {
         const message: Actions = {
           type: 'close-tab-master',
         };
         const port = DomHelper.activePorts[this.currentTabId];
         if (port) { port.postMessage(message); }
       }
     });
   }

   private onMessage() {
     const port = DomHelper.activePorts[this.currentTabId];

     const listenerExists = port?.onMessage.hasListener(this.onMessageListener);
     if (!listenerExists) {
       port?.onMessage.addListener(this.onMessageListener);
     }
   }

  //  TODO: implement this logic better
  //  private onDisconnect() {
  //    const port = DomHelper.activePorts[this.currentTabId];

  //    const cleanup = () => {
  //      port?.onMessage.removeListener(this.onMessageListener);
  //      // port = undefined;
  //    };

  //    const listenerExists = this.port?.onDisconnect.hasListener(cleanup);
  //    if (!listenerExists) {
  //      this.port?.onDisconnect.addListener(cleanup);
  //    }
  //  }
}

export default TabMaster;
