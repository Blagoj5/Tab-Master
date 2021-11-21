import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const app = (
	<React.StrictMode>
		<App />
	</React.StrictMode>
)

const rootElementId = process.env.NODE_ENV === 'production' ? 'tab-master-extension' : 'root';

ReactDOM.render(
  app,
  document.getElementById(rootElementId)
);