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
  const div = document.createElement('div');
  div.id = 'tab-master-extension';
  document.body.appendChild(div);

  // TODO: switch from div to dialog
  const divAnchor = document.getElementById('tab-master-extension');
  if (divAnchor) {
    divAnchor.style.zIndex = String(maxZIndex());
    // add css for this
    divAnchor.style.position = 'fixed';
    divAnchor.style.top = '0';
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
