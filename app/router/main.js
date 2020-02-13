const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');
const config = require('config');

const mainRouter = new Router();

mainRouter.get('/', async (ctx) => {
  ctx.body = config.app;
});

const entityRouter = require('./entity');
const projectRouter = require('./project');
const measureRouter = require('./measure');
const statementRouter = require('./statement');
const registerRouter = require('./register');
const docKS2Router = require('./docks2');
const docKS3Router = require('./docks3');

const router = combineRouters(
  mainRouter,
  entityRouter,
  projectRouter,
  measureRouter,
  statementRouter,
  registerRouter,
  docKS2Router,
  docKS3Router,
);

module.exports = router;
