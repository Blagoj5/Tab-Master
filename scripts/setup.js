const { copySync, existsSync, mkdirSync, writeFileSync } = require('fs-extra');
const path = require('path');

const packageJson = require('../package.json');
const manifestChromePath = path.resolve(
  __dirname,
  '../assets/manifest-chrome.json',
);
const manifestFirefoxPath = path.resolve(
  __dirname,
  '../assets/manifest-firefox.json',
);
const manifestChrome = require(manifestChromePath);
const manifestFirefox = require(manifestFirefoxPath);

const setup = async () => {
  if (!existsSync('build')) {
    mkdirSync('build');
  }

  // Have the versions up to date
  const currentPackageVersion = packageJson.version;
  manifestChrome.version = currentPackageVersion;
  manifestFirefox.version = currentPackageVersion;
  writeFileSync(manifestChromePath, JSON.stringify(manifestChrome, null, 2));
  writeFileSync(manifestFirefoxPath, JSON.stringify(manifestFirefox, null, 2));

  copySync('assets', 'build', { overwrite: true, recursive: true });
  copySync(
    'node_modules/webextension-polyfill/dist/browser-polyfill.js',
    'build/browser-polyfill.js',
    { overwrite: true },
  );
};

setup();
