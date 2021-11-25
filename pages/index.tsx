// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// This is the content script when running in production
if (process.env.NODE_ENV === 'production') {
  const div = document.createElement('div');
  div.id = 'tab-master-extension';
  document.body.appendChild(div);

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
