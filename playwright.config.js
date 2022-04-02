// @ts-check
const { devices, chromium, test: base, webkit } = require('@playwright/test');
const path = require('path');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
};

module.exports = config;

// TODO: firefox logic
// const path = require('path');
// const { firefox } = require('playwright');
// const webExt = require('web-ext').default;

// (async () => {
//   // 1. Enable verbose logging and start capturing logs.
//   webExt.util.logger.consoleStream.makeVerbose();
//   webExt.util.logger.consoleStream.startCapturing();

//   // 2. Launch firefox
//   const runner = await webExt.cmd.run({
//     sourceDir: path.join(__dirname, 'webextension'),
//     firefox: firefox.executablePath(),
//     args: [`-juggler=1234`],
//   }, {
//     shouldExitProgram: false,
//   });

//   // 3. Parse firefox logs and extract juggler endpoint.
//   const JUGGLER_MESSAGE = `Juggler listening on`;
//   const message = webExt.util.logger.consoleStream.capturedMessages.find(msg => msg.includes(JUGGLER_MESSAGE));
//   const wsEndpoint = message.split(JUGGLER_MESSAGE).pop();

//   // 4. Connect playwright and start driving browser.
//   const browser = await firefox.connect({ wsEndpoint });
//   const page = await browser.newPage();
//   await page.goto('https://mozilla.org');
//   // .... go on driving ....
// })();
