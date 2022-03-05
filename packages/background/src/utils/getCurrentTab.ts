const getCurrentTab = async () => {
  const queryOptions: browser.tabs._QueryQueryInfo = {
    active: true,
    currentWindow: true,
    // title: '',
    // url: '',
  };
  const [tab] = await browser.tabs.query(queryOptions);

  return tab;
};

export default getCurrentTab;
