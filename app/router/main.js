const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');
const config = require('config');

const mainRouter = new Router();

mainRouter.get('/', async(ctx) => {
    ctx.body = config.app
});

const entityRouter = require('./entity');

console.log(entityRouter);

const router = combineRouters(
  mainRouter,
  entityRouter
);


module.exports = router
