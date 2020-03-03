const Router = require('koa-router');
const passport = require('koa-passport');
const User = require('../models/user');
const { isAdmin } = require('../lib/auth');

const router = new Router();

// get all records
router.get('/user',
  passport.authenticate('jwt'),
  async (ctx) => {
    const q = ctx.request.query;
    const options = {};
    const filter = {};
    if (!isAdmin(ctx)) {
      filter._id = ctx.state.user.id;
    }

    if (q._sort) {
      const sort = q._sort === 'id' ? '_id' : q._sort;
      const order = q._order === 'DESC' ? -1 : 1;
      options.sort = { [sort]: order };
    }

    options.skip = Number(q._start);

    if (q._end) {
      options.limit = q._end - options.skip;
    }

    const list = await User.find(filter, null, options);
    const count = await User.countDocuments(filter, null, options);

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = list;
  });

// get one record by id
router.get('/user/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    if (!isAdmin(ctx) && (ctx.params.id !== ctx.state.user.id)) {
      ctx.throw(403, 'Доступ запрещен');
    }
    const filter = { _id: ctx.params.id };
    const record = await User.findOne(filter);
    ctx.body = record;
  });

// create new record
router.post('/user',
  passport.authenticate('jwt'),
  async (ctx) => {
    if (!isAdmin(ctx)) {
      ctx.throw(403, 'Доступ запрещен');
    }
    let record = new User({ ...ctx.request.body });
    record = await record.save();
    ctx.body = record;
  });

// update record
router.put('/user/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const adminFlag = isAdmin(ctx);
    if (!adminFlag && (ctx.params.id !== ctx.state.user.id)) {
      ctx.throw(403, 'Доступ запрещен');
    }
    let record = await User.findById(ctx.params.id);
    if (!record) {
      ctx.throw(404, 'Запись не напйдена');
    }

    const data = ctx.request.body;
    if (!adminFlag) {
      delete data.permissions;
    }
    record = await record.load(data).save();
    ctx.body = record;
  });

// delete record
router.delete('/user/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    if (!isAdmin(ctx) && (ctx.params.id !== ctx.state.user.id)) {
      ctx.throw(403, 'Доступ запрещен');
    }
    const filter = {
      _id: ctx.params.id,
    };

    const record = await User.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не напйдена');
    }
    const result = record.delete();
    ctx.body = result;
  });

module.exports = router;
