import getOpenTabMasterPayload from '../utils/openTabMaster';

export const openTabMaster = async (
  currentTab: Omit<browser.tabs.Tab, 'id'> & {
    id: number;
  },
  port: browser.runtime.Port,
) => {
  const message = await getOpenTabMasterPayload(
    'open-tab-master',
    currentTab?.id,
    currentTab?.url,
  );
  port.postMessage(message);
  return message;
};

export const closeTabMaster = async (port: browser.runtime.Port) => {
  const message = {
    type: 'close-tab-master',
  };
  port.postMessage(message);
};
