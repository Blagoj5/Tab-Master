// TODO: IMPLEMENT
// import stringSimilarity from 'string-similarity';
import { getMsForNDay } from '.';
import { loadSettings } from './storageConfig';

type CurrentTabState = {
  currentTabId: number;
  currentTabUrl?: string;
  openedTabs: browser.tabs.Tab[];
};
type GetRecentTabs = (
  // eslint-disable-next-line no-unused-vars
  currentTabState: CurrentTabState,
  // eslint-disable-next-line no-unused-vars
  keyword?: string,
) => Promise<browser.history.HistoryItem[]>;

const getRecentlyOpenedTabs: GetRecentTabs = async (
  { currentTabId, currentTabUrl, openedTabs },
  keyword = '',
) => {
  const config = await loadSettings();
  const historyItems = await browser.history.search({
    text: keyword,
    endTime: config?.history?.to ?? Date.now(),
    startTime: config?.history?.from ?? Date.now() - getMsForNDay(50),
    maxResults: config?.history?.maxResults ?? 20,
  });

  const openedTabsTitlesUrls = openedTabs.flatMap(({ url, title }) => {
    if (url && title) {
      return [url, title];
    }
    return [];
  });

  const isInOpenTabs = (item: browser.history.HistoryItem) => {
    const { url = '', title = '' } = item;
    return (
      openedTabsTitlesUrls.includes(url) || openedTabsTitlesUrls.includes(title)
    );
  };

  const filteredHistoryItems = historyItems.filter(
    // TODO: in future maybe better filtering, by checking if the url points to same content
    // TODO: dont't show it twice (if it's cannoncial link)
    (item) =>
      item.url &&
      item.id !== String(currentTabId) &&
      item.url !== currentTabUrl &&
      !isInOpenTabs(item),
  );

  // TODO: similarity needs to be added between the filtered history items them self
  // stringSimilarity.compareTwoStrings(item.url, currentTabUrl ?? '') && // TODO: add this to opened tabs
  return filteredHistoryItems;
};

export default getRecentlyOpenedTabs;
