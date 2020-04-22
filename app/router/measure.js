const Router = require('koa-router');
const passport = require('koa-passport');
const Measure = require('../models/measure');

const router = new Router();

// get all records
router.get('/measure',
  passport.authenticate('jwt'),
  async (ctx) => {
    const q = ctx.request.query;
    const filter = {
      user: ctx.state.user.id,
    };
    const options = {};

    if (q._sort) {
      const sort = q._sort === 'id' ? '_id' : q._sort;
      const order = q._order === 'DESC' ? -1 : 1;
      options.sort = { [sort]: order };
    }

    options.skip = Number(q._start);

    if (q._end) {
      options.limit = q._end - options.skip;
    }

    if (q.id) {
      filter._id = q.id;
    }

    const list = await Measure.find(filter, null, options);
    const count = await Measure.countDocuments(filter, null, options);

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = list;
  });

// get one record by id
router.get('/measure/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Measure.findOne(filter);
    ctx.body = record;
  });

// create new record
router.post('/measure',
  passport.authenticate('jwt'),
  async (ctx) => {
    const data = {
      ...ctx.request.body,
      user: ctx.state.user.id,
    };
    const record = new Measure();
    await record.load(data).save();
    ctx.body = record;
  });

// update record
router.put('/measure/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    let record = await Measure.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не найдена');
    }
    const data = ctx.request.body;
    record = await record.load(data).save();
    ctx.body = record;
  });

// delete record
router.delete('/measure/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Measure.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не найдена');
    }
    const result = record.delete();
    ctx.body = result;
  });

module.exports = router;
