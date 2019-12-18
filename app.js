const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');

const app = new Koa();
const router = new Router();

app.use(logger());

router.get('/', (ctx, next) => {
 ctx.body = {message: 'dordoc-api v0.0.2'}; 
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3007);