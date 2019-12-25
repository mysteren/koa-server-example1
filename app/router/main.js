const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');
const config = require('config');

const mainRouter = new Router();

mainRouter.get('/', async(ctx) => {
    ctx.body = config.app
});

const entityRouter = require('./entity'),
  projectRouter = require('./project'),
  measureRouter = require('./measure'),
  workRouter = require('./work');
 
const router = combineRouters(
  mainRouter,
  entityRouter,
  projectRouter,
  measureRouter,
  workRouter,
);


module.exports = router
