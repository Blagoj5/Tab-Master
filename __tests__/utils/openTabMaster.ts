// keyboard: https://github.com/puppeteer/puppeteer/blob/main/src/common/USKeyboardLayout.ts
// CMD + K -> Toggle
export const openExtensionMac = async () => {
    await page.keyboard.down('MetaLeft');
    await page.keyboard.down('k');
    await page.keyboard.up('k');
    await page.keyboard.down('MetaLeft');
}

// Control + K -> Toggle
export const openExtensionWindowsOrUb = async () => {
    await page.keyboard.down('ControlLeft');
    await page.keyboard.down('k');
    await page.keyboard.up('k');
    await page.keyboard.down('ControlLeft');
}

// CMD + SHIFT + K -> Only Open
export const openExtensionNativeMac = async () => {
    await page.keyboard.down('MetaLeft');
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('k');
    await page.keyboard.up('k');
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('MetaLeft');
}

// Control + SHIFT + K -> Only Open
export const openExtensionNativeWinOrUb = async () => {
    await page.keyboard.down('ControlLeft');
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('k');
    await page.keyboard.up('k');
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('ControlLeft');
}
