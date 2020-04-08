const Router = require('koa-router');
const passport = require('koa-passport');
const Statement = require('../models/statement');

const router = new Router();

// get all records
router.get('/statement',
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

    if (q.project) {
      filter.project = q.project;
    }

    if (q.work) {
      filter.work = q.work;
    }

    if (q.date_start || q.date_end) {
      filter.date = {};
      if (q.date_start) {
        filter.date.$gt = q.date_start
      }
      if (q.date_end) {
        filter.date.$lt = q.date_end
      }
    }

    const list = await Statement.find(filter, null, options);
    const count = await Statement.countDocuments(filter, null, options);

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = list;
  });

// get one record by id
router.get('/statement/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Statement.findOne(filter);
    ctx.body = record;
  });

// create new record
router.post('/statement',
  passport.authenticate('jwt'),
  async (ctx) => {
    const data = { ...ctx.request.body, user: ctx.state.user.id };
    const record = new Statement();
    await record.load(data).save();
    ctx.body = record;
  });

// update record
router.put('/statement/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    let record = await Statement.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не найдена');
    }
    const data = ctx.request.body;
    record = await record.load(data).save();
    ctx.body = record;
  });

// delete record
router.delete('/statement/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Statement.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не найдена');
    }
    const result = record.delete();
    ctx.body = result;
  });

/**
 * Custom queries
 */

// get project data
router.get('/get-statement-data/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Statement.findOne(filter)
      .populate([
        {
          path: 'project',
          populate: [
            'contractor',
            'customer',
            'subcontractors',
            'quality_control_services',
            'investor',
            'work_groups.works.measures.measure',
          ],
        },
      ]);
    ctx.body = record;
  });

module.exports = router;
