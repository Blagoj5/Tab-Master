// keyboard: https://github.com/puppeteer/puppeteer/blob/main/src/common/USKeyboardLayout.ts
const closeExtension = async () => {
    await page.keyboard.press('Escape');
}

export default closeExtension;
