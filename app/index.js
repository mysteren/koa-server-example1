const Koa = require('koa');
const logger = require('koa-logger');
const kbody = require('koa-body');
const config = require('config');
const cors = require('@koa/cors');
const router = require('./router/main');

const app = new Koa();

require('./db');

if (config.logger) {
  app.use(logger());
}

app.use(kbody());
app.use(cors());
app.use(router());
// app.use(router.allowedMethods());

let servPort = config.server.port;

if (config.util.getEnv('NODE_ENV') === 'test') {
  servPort = config.server_test.port;
}

app.listen(servPort, () => {
  console.log('%s listening at port %d', config.app.name, config.server.port);
});

module.exports = app;
