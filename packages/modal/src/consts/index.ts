/* eslint-disable import/prefer-default-export */

export const isProduction = process.env.NODE_ENV === 'production';
export const EXTENSION_ID = 'kaojdkhfdcegoonlpconenmjggghifak';
export const ROOT_ID = isProduction ? 'tab-master-extension' : 'root';
