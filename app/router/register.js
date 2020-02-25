const Router = require('koa-router');
const passport = require('koa-passport');
const Register = require('../models/register');
const Statement = require('../models/statement');

const router = new Router();

// get all records
router.get('/register',
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

    const list = await Register.find(filter, null, options);
    const count = await Register.countDocuments(filter, null, options);

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = list;
  });

// get one record by id
router.get('/register/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Register.findOne(filter);
    ctx.body = record;
  });

// create new record
router.post('/register',
  passport.authenticate('jwt'),
  async (ctx) => {
    const data = { ...ctx.request.body, user: ctx.state.user.id };
    const record = new Register();
    await record.load(data).save();
    ctx.body = record;
  });

// update record
router.put('/register/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    let record = await Register.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не найдена');
    }
    const data = ctx.request.body;
    record = await record.load(data).save();
    ctx.body = record;
  });

// delete record
router.delete('/register/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Register.findOne(filter);
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
router.get('/get-register-data/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const output = {
      register: null,
      statements: [],
    };
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const register = await Register.findOne(filter)
      .populate([
        {
          path: 'project',
          populate: [
            'contractor',
            'customer',
            'investor',
            'subcontractors',
            'quality_control_services',
            'work_groups.works.measures.measure',
          ],
        },
      ]);

    if (register) {
      output.register = register;
      if (register.project) {
        output.statements = await Statement.find({
          project: register.project._id,
          date: { $gte: register.start_date, $lte: register.end_date },
        });
      }
    }
    ctx.body = output;
  });

module.exports = router;
