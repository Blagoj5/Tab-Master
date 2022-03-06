/* eslint-disable import/prefer-default-export */

export const isProduction = process.env.NODE_ENV === 'production';
export const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
export const EXTENSION_ID = browser.runtime?.id ?? 'kaojdkhfdcegoonlpconenmjggghifak';
export const ROOT_ID = 'root';
