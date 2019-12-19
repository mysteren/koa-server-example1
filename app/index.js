'use strict';

const Koa = require('koa');
const logger = require('koa-logger');
const config = require('config');

const app = new Koa();
const router = require('./router/main');
require('./db');

console.log(router);
 
app.use(logger());  
app.use(router());
// app.use(router.allowedMethods());
app.listen(config.server.port, () => {
    console.log('%s listening at port %d', config.app.name, config.server.port);
});