const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');
const passport = require('koa-passport');
const config = require('config');

const mainRouter = new Router();

mainRouter.get('/',
  passport.authenticate('jwt'),
  async (ctx) => {
    const n = ctx.session.views + 1 || 0;
    const body = {
      version: config.app.version,
      cookies: ctx.cookies.get('koa:sess'),
      views: n,
    };
    ctx.session.views = n;
    ctx.body = body;
  });

const authRouter = require('./auth');
const entityRouter = require('./entity');
const projectRouter = require('./project');
const measureRouter = require('./measure');
const statementRouter = require('./statement');
const registerRouter = require('./register');
const docKS2Router = require('./docks2');
const docKS3Router = require('./docks3');
const userRouter = require('./user');


const router = combineRouters(
  mainRouter,
  authRouter,
  entityRouter,
  projectRouter,
  measureRouter,
  statementRouter,
  registerRouter,
  docKS2Router,
  docKS3Router,
  userRouter,
);

module.exports = router;
