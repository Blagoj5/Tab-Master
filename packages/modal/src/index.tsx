// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { ROOT_ID } from './consts';

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// This is the content script when running in production
if (process.env.NODE_ENV === 'production') {
  const dialog = document.createElement('dialog');
  dialog.id = ROOT_ID;
  document.body.appendChild(dialog);

  dialog.open = true;
  const dialogAnchor = document.getElementById(ROOT_ID);
  if (dialogAnchor) {
    dialogAnchor.style.zIndex = '2147483647';
    dialogAnchor.style.border = '0';
    dialogAnchor.style.padding = '0';
    dialogAnchor.style.height = 'auto';
    dialogAnchor.style.width = 'auto';
  }

  ReactDOM.render(app, document.getElementById(ROOT_ID));
} else {
  ReactDOM.render(app, document.getElementById(ROOT_ID));
}
