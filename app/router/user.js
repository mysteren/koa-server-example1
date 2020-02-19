const Router = require('koa-router');
const passport = require('koa-passport');
const User = require('../models/user');

const router = new Router();

// get all records
router.get('/user',
  passport.authenticate('jwt'),
  async (ctx) => {
    const q = ctx.request.query;
    const options = {};
    const filter = {};

    if (!ctx.state.user.permissions.includes('admin')) {
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

    const list = await User.find(filter, null, options).exec();

    const count = await User.countDocuments(filter, null, options).exec();

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = list;
  });

// get one record by id
router.get('/user/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const record = await User.findById(ctx.params.id);
    ctx.body = record;
  });

// create new record
router.post('/user',
  passport.authenticate('jwt'),
  async (ctx) => {
    try {
      if (!ctx.state.user.permissions.includes('admin')) {
        ctx.status = 403;
        ctx.body = 'Доступ запрещен';
        return;
      }
      let record = new User({ ...ctx.request.body });
      record = await record.save();
      ctx.body = record;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  });

// update record
router.put('/user/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    try {
      const isAdmin = ctx.state.user.permissions.includes('admin');
      if (!isAdmin && (ctx.params.id !== ctx.state.user.id)) {
        ctx.status = 403;
        ctx.body = 'Доступ запрещен';
        return;
      }
      let record = await User.findById(ctx.params.id);
      if (!record) {
        throw Error('запись не найдена');
      }

      const data = ctx.request.body;
      if (!isAdmin) {
        delete data.permissions;
      }

      record = await record.load(data).save();
      ctx.body = record;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  });

// delete record
router.delete('/user/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const record = await User.findByIdAndDelete(ctx.params.id);
    ctx.body = record;
  });

module.exports = router;
