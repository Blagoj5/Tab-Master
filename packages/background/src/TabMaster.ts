import { Actions } from '@tab-master/common/build/types';
import type DomHelper from './DomHelper';

class TabMaster {
   private port: chrome.runtime.Port | undefined;

   // eslint-disable-next-line no-unused-vars
   private onMessageListener: (message: Actions, port: chrome.runtime.Port) => void;

   domHelper: DomHelper;

   constructor(domHelper: DomHelper, onMessageListener: TabMaster['onMessageListener']) {
     this.onMessageListener = onMessageListener;
     this.domHelper = domHelper;
   }

   async init() {
     await this.domHelper.loadSettings(async () => {
       //  TODO: THIS IS DUPLICATION
       if (!this.domHelper.settings.extensionEnabled) return;

       await this.domHelper.connectToContentScript();

       if (!this.domHelper.currentTab?.id) return;

       this.port = this.domHelper.activePorts[this.domHelper.currentTab.id];
       if (!this.port) return;

       const openedTabs = await this.domHelper.getOpenedTabs();
       const recentlyOpenedTabs = await this.domHelper.getRecentlyOpenedTabs();

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
       //  if extension is disabled from settings, find a better way for this
       if (!this.domHelper.settings.extensionEnabled) return;

       // CMD + K
       if (command === 'open-tab-master') {
         await this.openTabMaster();
       }

       // TODO: I CAN't FIND ESCAPE FOR chrome.commands, even in chrome://extensions/shortcuts
       // Escape
       if (command === 'close-tab-master') {
         const message: Actions = {
           type: 'close-tab-master',
         };
         if (!this.domHelper.currentTab?.id) return;
         const port = this.domHelper.activePorts[this.domHelper.currentTab.id];
         if (port) { port.postMessage(message); }
       }
     });
   }

   async openTabMaster() {
     await this.domHelper.connectToContentScript();

     if (!this.domHelper.currentTab?.id) return;

     this.port = this.domHelper.activePorts[this.domHelper.currentTab.id];
     if (!this.port) return;

     const openedTabs = await this.domHelper.getOpenedTabs();
     const recentlyOpenedTabs = await this.domHelper.getRecentlyOpenedTabs();

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

   private onMessage() {
     const listenerExists = this.port?.onMessage.hasListener(this.onMessageListener);
     if (!listenerExists) {
       this.port?.onMessage.addListener(this.onMessageListener);
     }
   }

  //  TODO: implement this logic better
  //  private onDisconnect() {
  //    const port = this.domHelper.activePorts[this.currentTabId];

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
