import { Actions } from '../common';
import DomHelper from './DomHelper';

class TabMaster {
   port: chrome.runtime.Port | undefined;

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

         if (!this.port || !this.port.name.includes(String(currentTab.id))) {
           this.port = await DomHelper.connectToContentScript();
         }

         const openedTabs = await DomHelper.getOpenedTabs();
         const recentlyOpenedTabs = await DomHelper.getRecentlyOpenedTabs();

         const openMessage: Actions = {
           type: 'open-tab-master',
           tabs: {
             open: openedTabs,
             recent: recentlyOpenedTabs,
           },
         };

         try {
           this.port.postMessage(openMessage);

           // Listeners
           this.onDisconnect();
           this.onMessage();
         } catch (error) {
           // eslint-disable-next-line no-console
           console.error('handled err: ', error);
           this.port = undefined;
         }
       }

       // TODO: I CAN't FIND ESCAPE FOR chrome.commands, even in chrome://extensions/shortcuts
       // Escape
       if (command === 'close-tab-master') {
         const message: Actions = {
           type: 'close-tab-master',
         };
         this.port?.postMessage(message);
       }
     });
   }

   private onMessage() {
     const listenerExists = this.port?.onMessage.hasListener(this.onMessageListener);
     if (!listenerExists) {
       this.port?.onMessage.addListener(this.onMessageListener);
     }
   }

   private onDisconnect() {
     const cleanup = () => {
       this.port?.onMessage.removeListener(this.onMessageListener);
       this.port = undefined;
     };

     const listenerExists = this.port?.onDisconnect.hasListener(cleanup);
     if (!listenerExists) {
       this.port?.onDisconnect.addListener(cleanup);
     }
   }
}

export default TabMaster;
