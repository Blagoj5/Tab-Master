// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setBrowserStorage = (items: { [key: string]: any; }) => {
  if (!browser?.storage?.sync) {
    // eslint-disable-next-line no-console
    console.warn('Chrome storage is not available');
    return;
  }
  browser.storage.sync.set(items);
};

export default setBrowserStorage;
