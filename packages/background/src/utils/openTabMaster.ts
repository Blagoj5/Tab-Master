import { Actions } from '@tab-master/common/build/types';
import getOpenedTabs from './getOpenedTabs';
import getRecentlyOpenedTabs from './getRecentlyOpenedTabs';

const getOpenTabMasterPayload = async (
  type: 'current-state' | 'open-tab-master',
  currentTabId: number,
  currentTabUrl?: string,
) => {
  const openedTabs = await getOpenedTabs(currentTabId, currentTabUrl);

  const recentlyOpenedTabs = await getRecentlyOpenedTabs({
    currentTabId,
    currentTabUrl,
  }, '');

  const payload: Actions = {
    type,
    tabs: {
      open: openedTabs,
      recent: recentlyOpenedTabs,
    },
  };

  return payload;
};

export default getOpenTabMasterPayload;
