import { Actions } from '@tab-master/common/build/types';
import getOpenedTabs from './getOpenedTabs';
import getRecentlyOpenedTabs from './getRecentlyOpenedTabs';
import { loadSettings } from './storageConfig';

const getOpenTabMasterPayload = async (
  type: 'current-state' | 'open-tab-master',
  currentTabId: number,
  currentTabUrl?: string,
) => {
  const config = await loadSettings();
  let openedTabs: browser.tabs.Tab[] = [];
  if (config.openTabsEnabled) {
    openedTabs = await getOpenedTabs(currentTabId, currentTabUrl);
  }

  let recentlyOpenedTabs: browser.history.HistoryItem[] = [];
  if (config.recentTabsEnabled) {
    recentlyOpenedTabs = await getRecentlyOpenedTabs(
      {
        currentTabId,
        currentTabUrl,
        openedTabs,
      },
      '',
    );
  }

  const payload = {
    type,
    tabs: {
      open: openedTabs,
      recent: recentlyOpenedTabs,
    },
  } as const;

  return payload;
};

export default getOpenTabMasterPayload;
