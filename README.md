## TAB MASTER

### Demo video

[![Demo Vide](https://user-images.githubusercontent.com/5396211/160577491-7d593bf5-2cfa-4cc7-9dd3-d9cf02f360d1.png)](https://www.youtube.com/watch?v=v-OYzhYR0s8)


## Architecture

- Background script/worker

  - Used for listening to initial command for opening and staring the modal
  - Used for sending tabs, history and bookmarks to the content/react script

- Content script (modal)
  - Statically injected (all time available), and not programmatically
  - Used for creating the dialog with specific id that react script will use
  - Used for creating and injecting the react script to the previously created dialog with a specific ID

### Chrome

#### How to build and test locally

- yarn build
- Go to `chrome://extensions`
- Enable dev switch
- Load unpacked
- Go to any page and press ctrl/cmd + key

#### How to use it for dev

- yarn build:watch
- Go to `chrome://extensions`
- Enable dev switch
- Load unpacked
- Go to any page and press ctrl/cmd + key
- If you do any changes it will automatically build the extension with all the changes, you only have to press on the refresh icon of the extension

#### How to use it for dev, individually each package

- Go to the package you want to run and do `yarn`, followed by `yarn dev`
- `yarn build` used from inside the package, it will only build that package in the current folder

### Firefox

#### How to build and test locally

- yarn build
- Go to `about://debugging` -> `This Firefox`
- Load Temporary Add-on -> Select `build-firefox/manifest.json`
- Go to any page and press ctrl/cmd + key

#### How to use it for dev

- yarn build:watch
- Go to `about://debugging` -> `This Firefox`
- Load Temporary Add-on -> Select `build-firefox/manifest.json`
- Go to any page and press ctrl/cmd + key
- If you do any changes it will automatically build the extension with all the changes, you only have to press on the refresh icon of the extension

### Project Structure

MONOREPO, using yarn workspaces:

- packages
  - modal
  - common (used for types and utilities that are shared between background script and content script/s)
  - popup (currently being build, will be the actual config page)
  - config (the actual config page, full screen version of popup)
- scripts
  - setup.js - used for copying all the needed files (manifest.json, etc..)
  - build.js - used for building the extension itself
