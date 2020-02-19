const Koa = require('koa');
const logger = require('koa-logger');
const kbody = require('koa-body');
const config = require('config');
const cors = require('@koa/cors');
const session = require('koa-session');
const passport = require('koa-passport');
const router = require('./router/main');

const app = new Koa();
app.keys = ['NJqR4iNjKbFXNqWK'];

require('./db');

if (config.logger) {
  app.use(logger());
}


let servPort = config.server.port;

if (config.util.getEnv('NODE_ENV') === 'test') {
  servPort = config.server_test.port;
}

app.use(kbody());
app.use(cors());
app.use(session(config.session, app));

require('./auth');

app.use(passport.initialize());
app.use(passport.session());
app.use(router());
// app.use(router.allowedMethods());

const server = app.listen(servPort);

module.exports = server;
