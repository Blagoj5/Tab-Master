import { Actions } from '@tab-master/common/build/types';
import type DomHelper from './DomHelper';

class TabMaster {
   private port: browser.runtime.Port | undefined;

   // eslint-disable-next-line no-unused-vars
   //  private onMessageListener: (message: Actions, port: browser.runtime.Port) => void;

   domHelper: DomHelper;

   constructor(domHelper: DomHelper) {
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
       const hasListener = this.port.onMessage.hasListener(this.onMessageListener);
       if (!hasListener) {
         this.port.onMessage.addListener(this.onMessageListener);
       }
     });

     browser.commands.onCommand.addListener(async (command) => {
       //  if extension is disabled from settings, find a better way for this
       if (!this.domHelper.settings.extensionEnabled) return;

       // CMD + K
       if (command === 'open-tab-master') {
         await this.openTabMaster();
       }

       // TODO: I CAN't FIND ESCAPE FOR browser.commands, even in chrome://extensions/shortcuts
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

     const hasListener = this.port.onMessage.hasListener(this.onMessageListener);
     if (!hasListener) {
       this.port.onMessage.addListener(this.onMessageListener);
     }
   }

   private onMessageListener(message: object) {
     const isActions = (data:any): data is Actions => Boolean(data);
     if (!isActions(message)) return;

     switch (message.type) {
       case 'switch-tab':
         browser.tabs.update(message.tabId, { active: true });
         break;
       case 'search-history':
         this.domHelper.getRecentlyOpenedTabs(message.keyword)
           .then((recentTabs) => {
             const payload: Actions = {
               type: 'send-recent-tabs',
               tabs: recentTabs,
             };
             if (!this.port) throw new Error('port does not exist');
             this.port.postMessage(payload);
           });
         break;
       case 'open-tab':
         browser.tabs.create({
           active: true,
           url: message.newTabUrl,
         });
         break;
       default:
         break;
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
