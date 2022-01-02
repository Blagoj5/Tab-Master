import { Actions } from '@tab-master/common/build/types';
import DomHelper from './DomHelper';

class TabMaster {
   private port: chrome.runtime.Port | undefined;

   // eslint-disable-next-line no-unused-vars
   private onMessageListener: (message: Actions, port: chrome.runtime.Port) => void;

   constructor(onMessageListener: TabMaster['onMessageListener']) {
     this.onMessageListener = onMessageListener;
   }

   async init() {
     await DomHelper.loadSettings(async () => {
       //  TODO: THIS IS DUPLICATION
       if (!DomHelper.settings.extensionEnabled) return;

       await DomHelper.connectToContentScript();

       this.port = DomHelper.activePorts[DomHelper.currentTabId];
       if (!this.port) return;

       const openedTabs = await DomHelper.getOpenedTabs();
       const recentlyOpenedTabs = await DomHelper.getRecentlyOpenedTabs();

       const openMessage: Actions = {
         type: 'current-state',
         tabs: {
           open: openedTabs,
           recent: recentlyOpenedTabs,
         },
       };

       this.port.postMessage(openMessage);

       // Listeners
       // this.onDisconnect();
       this.onMessage();
     });

     chrome.commands.onCommand.addListener(async (command) => {
       //  if extension is disabled from settings
       if (!DomHelper.settings.extensionEnabled) return;

       // CMD + K
       if (command === 'open-tab-master') {
         await DomHelper.connectToContentScript();

         this.port = DomHelper.activePorts[DomHelper.currentTabId];
         if (!this.port) return;

         const openedTabs = await DomHelper.getOpenedTabs();
         const recentlyOpenedTabs = await DomHelper.getRecentlyOpenedTabs();

         const openMessage: Actions = {
           type: 'open-tab-master',
           tabs: {
             open: openedTabs,
             recent: recentlyOpenedTabs,
           },
         };

         this.port.postMessage(openMessage);

         // Listeners
         // this.onDisconnect();
         this.onMessage();
       }

       // TODO: I CAN't FIND ESCAPE FOR chrome.commands, even in chrome://extensions/shortcuts
       // Escape
       if (command === 'close-tab-master') {
         const message: Actions = {
           type: 'close-tab-master',
         };
         const port = DomHelper.activePorts[DomHelper.currentTabId];
         if (port) { port.postMessage(message); }
       }
     });
   }

   private onMessage() {
     const listenerExists = this.port?.onMessage.hasListener(this.onMessageListener);
     if (!listenerExists) {
       this.port?.onMessage.addListener(this.onMessageListener);
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
