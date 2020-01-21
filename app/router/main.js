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
const workRouter = require('./work');
const actRouter = require('./act');

const router = combineRouters(
  mainRouter,
  entityRouter,
  projectRouter,
  measureRouter,
  workRouter,
  actRouter,
);


module.exports = router;
