import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { ROOT_ID } from './consts';

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.render(
  app,
  document.getElementById(ROOT_ID),
);
