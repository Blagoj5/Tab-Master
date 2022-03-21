const getPageCount = async () => (await browser.pages()).length;

export default getPageCount;
