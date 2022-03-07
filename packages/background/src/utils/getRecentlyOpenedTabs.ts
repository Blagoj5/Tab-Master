import { getMsForNDay } from '.';
import { loadSettings } from './storageConfig';

type CurrentTabState = { currentTabId: number, currentTabUrl?: string};
type GetRecentTabs = (
  // eslint-disable-next-line no-unused-vars
  currentTabState: CurrentTabState,
  // eslint-disable-next-line no-unused-vars
  keyword?: string,
) => Promise<browser.history.HistoryItem[]>;

const getRecentlyOpenedTabs: GetRecentTabs = async (
  {
    currentTabId,
    currentTabUrl,
  },
  keyword = '',
) => {
  const config = await loadSettings();
  const historyItems = await browser.history.search({
    text: keyword,
    endTime: config?.history?.to ?? Date.now(),
    startTime: config?.history?.from ?? Date.now() - getMsForNDay(50),
    maxResults: config?.history?.maxResults ?? 20,
  });

  const filteredHistoryItems = historyItems.filter(
    // TODO: in future maybe better filtering, by checking if the url points to same content
    // TODO: dont't show it twice (if it's cannoncial link)
    (item) => item.id !== String(currentTabId) && item.url !== currentTabUrl,
  );
  return filteredHistoryItems;
};

export default getRecentlyOpenedTabs;
