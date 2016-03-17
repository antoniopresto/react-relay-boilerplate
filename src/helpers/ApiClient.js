import superagent from 'superagent';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path, optionalHost) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  const host = optionalHost || 'http://' + config.remoteApiHost + ':' + config.remoteApiPort;
  return host + '/api' + adjustedPath;
}

class _ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data, headers } = {}, optinalHost) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path, optinalHost));

        if (params) {
          request.query(params);
        }

        if (headers) {
          request.set(headers);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
