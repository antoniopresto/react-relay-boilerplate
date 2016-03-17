import superagent from 'superagent';

export default function api(req, [v = 'v1', area = 'social', instance = 55, page = 1, offset = 0]) {
  const api_token = req.get('api_token');
  return new Promise((resolve) => {
    superagent
      .get(`http://54.207.43.173:4730/api/${v}/${area}/${instance}/${page}/${offset}`)
      .set({api_token})
      .end((err, res) => {
        resolve(res);
      });
  });
}
