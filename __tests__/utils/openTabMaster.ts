// keyboard: https://github.com/puppeteer/puppeteer/blob/main/src/common/USKeyboardLayout.ts

import { Page } from '@playwright/test';

// CMD + K -> Toggle
export const openExtensionMac = async (selectedPage: Page) => {
  await selectedPage.keyboard.down('MetaLeft');
  await selectedPage.keyboard.down('k');
  await selectedPage.keyboard.up('k');
  await selectedPage.keyboard.down('MetaLeft');
};

// Control + K -> Toggle
export const openExtensionWindowsOrUb = async (selectedPage: Page) => {
  await selectedPage.keyboard.down('ControlLeft');
  await selectedPage.keyboard.down('k');
  await selectedPage.keyboard.up('k');
  await selectedPage.keyboard.down('ControlLeft');
};

// CMD + SHIFT + K -> Only Open
export const openExtensionNativeMac = async (selectedPage: Page) => {
  await selectedPage.keyboard.down('MetaLeft');
  await selectedPage.keyboard.down('ShiftLeft');
  await selectedPage.keyboard.down('k');
  await selectedPage.keyboard.up('k');
  await selectedPage.keyboard.down('ShiftLeft');
  await selectedPage.keyboard.down('MetaLeft');
};

// Control + SHIFT + K -> Only Open
export const openExtensionNativeWinOrUb = async (selectedPage: Page) => {
  await selectedPage.keyboard.down('ControlLeft');
  await selectedPage.keyboard.down('ShiftLeft');
  await selectedPage.keyboard.down('k');
  await selectedPage.keyboard.up('k');
  await selectedPage.keyboard.down('ShiftLeft');
  await selectedPage.keyboard.down('ControlLeft');
};
