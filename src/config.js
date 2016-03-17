require('babel/polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  disableSSR: true,
  host: process.env.HOST,
  port: process.env.PORT,
  apiHost: process.env.APIHOST,
  apiPort: process.env.APIPORT,
  remoteApiHost: '',
  remoteApiPort: '',
  remoteLoginPath: '',
  userDefaultPic: '',
  app: {
    title: 'ALTERAR TITLE, ETC',
    description: 'ALTERAR DESCRICAO',
    head: {
      titleTemplate: 'InCeres: %s',
      meta: [
        {name: 'description', content: 'InCeres AgSystem'},
        {charset: 'utf-8'}
      ]
    }
  },

}, environment);
