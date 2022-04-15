const getCurrentTab = async () => {
  const queryOptions: browser.tabs._QueryQueryInfo = {
    active: true,
    // currentWindow: true, // TODO: just enable
  };
  const [tab] = await browser.tabs.query(queryOptions);
  if (!tab) throw new Error('No current tab found');

  return tab;
};

export default getCurrentTab;
