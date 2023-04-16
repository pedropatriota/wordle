import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import WordleContextProvider from './WordleContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <WordleContextProvider>
      <App />
    </WordleContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
