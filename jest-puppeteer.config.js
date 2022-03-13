require('dotenv').config();
const path = require('path');

const extensionChromeLocation = path.resolve(__dirname, 'build-chrome');
const extensionFirefoxLocation = path.resolve(__dirname, 'build-firefox');

module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
    product: 'chrome',
    args: [
      `--disable-extensions-except=${extensionChromeLocation}`,
      `--load-extension=${extensionChromeLocation}`,
      `--window-size=1280,800`,
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-web-security',
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-accelerated-2d-canvas',
      "--disable-gpu"
    ]
  },
  browserContext: 'default',
}
