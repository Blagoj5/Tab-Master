const getOpenedTabs = async (currentTabId: number, currentTabUrl?: string) => {
  const tabs = await browser.tabs.query({
    currentWindow: true,
  });

  return tabs.filter(
    (item) => item.id !== currentTabId && item.url !== currentTabUrl,
  );
};

export default getOpenedTabs;
