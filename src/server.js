import Express from 'express';
import React from 'react';
import ReactDOM, {renderToString} from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
import scrape, {clearCache} from './helpers/scrape';

import {Router, match, createMemoryHistory} from 'react-router';

import {Provider} from 'react-redux';
import qs from 'query-string';
import getRoutes from './routes';
import getStatusFromRoutes from './helpers/getStatusFromRoutes';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));

app.use('/api/scrape/:url/:scrapeID', (req, res) => {
  // console.log('REQ_SCRAPE');
  const {url, scrapeID} = req.params;
  scrape(url, scrapeID).then(result => {
      // console.log('RES_SCRAPE:', JSON.stringify(result, null, 2));
      return res.json(result);
    },
    error => {
      res.status(501);
      res.json({error});
    });
});

app.use('/api/scrape/clear', (req, res) => {
  clearCache().then(data => {
    res.json(data);
  }).catch(err => res.json(err));
});

// Proxy to API server
app.use('/api/*', (req, res) => {
  const proxyUrl = `http://54.207.43.173:4730/${req.originalUrl}`;
  proxy.web(req, res, {target: proxyUrl}, function(err) {
    console.log(err);
    res.status(501);
    res.json({error: true}); // não enviar detalhes do erro ao client
  });
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }

  // react-router 2.0
  // https://github.com/rackt/react-router/blob/master/upgrade-guides/v2.0.0.md#using-custom-histories
  const history = createMemoryHistory({});
  history.push(req.url);

  const clientApi = new ApiClient(req);
  const store = createStore(history, clientApi);
  const routes = getRoutes(store);


  if (config.disableSSR) {
    return res.send(
      '<!doctype html>\n' +
      renderToString(
        <Html
          assets={webpackIsomorphicTools.assets()}
          store={store}
        />
      )
    );
  }

  const ssrComponent = (
    <Provider store={store} key="provider">
      <Router routes={routes} history={history}/>
    </Provider>
  );

  match({
    history,
    routes,
    location: req.url
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {

      const status = getStatusFromRoutes(renderProps.routes);

      if (status)
        res.status(status);

      res.send(
        '<!doctype html>\n' +
        renderToString(
          <Html
            assets={webpackIsomorphicTools.assets()}
            store={store}
            component={ssrComponent}
          />
        )
      );

    } else {
      res.status(404).send('Not found')
    }
  });

});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
