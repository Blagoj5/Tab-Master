## TAB MASTER

### VIDEO
[https://user-images.githubusercontent.com/50581470/142780574-eb298e28-399f-4ba6-9b9f-0ae963e2b3bd.mov](VIDEO)

## Architecture

- Background script/worker
  - Used for commands on top of the event listener by the react script/content script (not yet added)
  - Used for sending tabs, history, bookmarks and etc... to the react script which is injected from the content script

- Content script
  - Statically injected (all time available), and not programmatically
  - Used for creating the div with specific id that react script will use to re-render
  - Used for creating and injecting the react script to the previously created div with a specific id

- React/Main Extension script
  - Build into a single bundle.js
  - That bundle.js used for rendering the extension


### How to build and test locally
- yarn build
- Go to `chrome://extensions`
- Enable dev switch
- Load unpacked
- Go to any page and press ctrl/cmd + key

### Similar Project
- https://github.com/babyman/quick-tabs-chrome-extension/blob/master/quick-tabs/background.js
