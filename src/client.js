/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill';
import React from 'react';
import {Router, browserHistory} from 'react-router';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import {Provider} from 'react-redux';
import jQuery from 'jquery';
import getRoutes from './routes';

global.HISTORIA = browserHistory;
global.jQuery = jQuery;
global.$ = jQuery;

const clientApi = new ApiClient();

const dest = document.getElementById('content');
const store = createStore(browserHistory, clientApi, window.__data);

class ComponentByRoute extends React.Component {
  render() {
    return <Router routes={getRoutes(store)} history={browserHistory} />;
  }
}
ReactDOM.render(
  <Provider store={store} key="provider">
    <ComponentByRoute />
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    // console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
    console.info('no ssr.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        <ComponentByRoute />
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
