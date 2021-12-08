// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function maxZIndex() {
  return Array.from(document.querySelectorAll('body *'))
    .map((a) => parseFloat(window.getComputedStyle(a).zIndex))
    .filter((a) => !Number.isNaN(a))
    .sort((a, b) => a - b)
    .pop();
}

// This is the content script when running in production
if (process.env.NODE_ENV === 'production') {
  const dialog = document.createElement('dialog');
  dialog.id = 'tab-master-extension';
  document.body.appendChild(dialog);

  dialog.open = true;
  const dialogAnchor = document.getElementById('tab-master-extension');
  if (dialogAnchor) {
    dialogAnchor.style.zIndex = String(maxZIndex());
    // add css for this
    dialogAnchor.style.position = 'fixed';
    dialogAnchor.style.top = '0';
  }

  ReactDOM.render(
    app,
    document.getElementById('tab-master-extension'),
  );
} else {
  ReactDOM.render(
    app,
    document.getElementById('root'),
  );
}
