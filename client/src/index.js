import React from 'react';
import ReactDOM from 'react-dom';
import './Resources/css/styles.css';

import store from './store';

import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';

import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
