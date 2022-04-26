import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// This is the content script when running in production
ReactDOM.render(app, document.getElementById('root'));
