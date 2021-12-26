## TAB MASTER

### VIDEO
[https://user-images.githubusercontent.com/50581470/142780574-eb298e28-399f-4ba6-9b9f-0ae963e2b3bd.mov](VIDEO)

## Architecture

- Background script/worker
  - Used for listening to initial command for opening and staring the modal 
  - Used for sending tabs, history and bookmarks to the content/react script

- Content script (modal)
  - Statically injected (all time available), and not programmatically
  - Used for creating the dialog with specific id that react script will use
  - Used for creating and injecting the react script to the previously created dialog with a specific ID

### How to build and test locally
- yarn build
- Go to `chrome://extensions`
- Enable dev switch
- Load unpacked
- Go to any page and press ctrl/cmd + key

### How to use it for dev
- yarn build:watch
- Go to `chrome://extensions`
- Enable dev switch
- Load unpacked
- Go to any page and press ctrl/cmd + key
- If you do any changes it will automatically build the extension with all the changes, you only have to press on the refresh icon of the extension

### How to use it for dev, individually each package
- Go to the package you want to run and do `yarn`, followed by `yarn dev`
- `yarn build` used from inside the package, it will only build that package in the current folder

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

### Similar Project
- https://github.com/babyman/quick-tabs-chrome-extension/blob/master/quick-tabs/background.js
