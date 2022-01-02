// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setChromeStorage = (items: { [key: string]: any; }) => {
  if (!chrome?.storage?.sync) {
    // eslint-disable-next-line no-console
    console.warn('Chrome storage is not available');
    return;
  }
  chrome.storage.sync.set(items);
};

export default setChromeStorage;
