import { isCurrentTab } from '../types';
import getCurrentTab from './getCurrentTab';

type MessageListener = (
  message: object,
  port: browser.runtime.Port,
  currentTab: Omit<browser.tabs.Tab, 'id'> & {
    id: number;
  },
) => Promise<void>;

class PortController {
  activePorts: Record<string, browser.runtime.Port> = {};

  constructor(onMessageListener?: MessageListener) {
    this.activePorts = {};
    browser.runtime.onConnect.addListener(async (port) => {
      const currentTab = await getCurrentTab();
      if (!isCurrentTab(currentTab)) throw new Error('No current tab');
      const currentTabId = currentTab.id;

      this.activePorts = {
        ...this.activePorts,
        [currentTabId]: port,
      };

      const listener = (message: object) =>
        onMessageListener?.(message, port, currentTab);

      port.onDisconnect.addListener(() => {
        delete this.activePorts[currentTabId];
        if (onMessageListener) port.onMessage.removeListener(listener);
      });

      if (onMessageListener) port.onMessage.addListener(listener);
    });
  }

  getCurrentTab = async () => {
    const currentTab = await getCurrentTab();
    if (!isCurrentTab(currentTab)) throw new Error('No current tab');
    return currentTab;
  };

  private getCurrentTabId = async () => {
    const currentTab = await this.getCurrentTab();
    return currentTab.id;
  };

  getPort = async (): Promise<browser.runtime.Port | undefined> => {
    const currentTabId = await this.getCurrentTabId();
    return this.activePorts[currentTabId];
  };
}

export default PortController;
