import { checkTabLoaded } from '.';

const loadedTabs: Record<string, any> = {};
const activePorts: Record<string, any> = {};

const connectToTabContentScript = async (
  currentTabId: number,
): Promise<browser.runtime.Port | null> => {
  if (!currentTabId) throw new Error('Current tab does not exist');

  let tabIsLoaded = Boolean(loadedTabs[currentTabId]);
  if (!tabIsLoaded) tabIsLoaded = await checkTabLoaded(currentTabId);
  if (tabIsLoaded) {
    const existingPort = activePorts[currentTabId];
    if (existingPort) {
      return existingPort;
    }
    const port = browser.tabs.connect(currentTabId, {
      name: `init-${currentTabId}`,
    });
    port.onDisconnect.addListener(() => {
      delete activePorts[currentTabId as number];
    });
    activePorts[currentTabId] = port;
    return port;
  }
  // eslint-disable-next-line no-console
  console.warn('Content script on open tab is not loaded yet');
  return null;
  // reject(new Error('Content script on open tab is not loaded yet'));
};

export default connectToTabContentScript;
