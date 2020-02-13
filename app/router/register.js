const Router = require('koa-router');
const Register = require('../models/register');
const Statement = require('../models/statement');

const router = new Router();

// get all records
router.get('/register', async (ctx) => {
  const q = ctx.request.query;
  const filter = {};
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

  const list = await Register.find(filter, null, options).exec();
  const count = await Register.countDocuments(filter, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/register/:id', async (ctx) => {
  const record = await Register.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/register', async (ctx) => {
  try {
    const record = new Register({ ...ctx.request.body });
    await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/register/:id', async (ctx) => {
  try {
    let record = await Register.findByIdAndUpdate(
      ctx.params.id,
      { ...ctx.request.body },
      { useFindAndModify: false, runValidators: true },
    );
    record = await Register.findById(ctx.params.id);
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/register/:id', async (ctx) => {
  const record = await Register.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

/**
 * Custom queries
 */

// get project data
router.get('/get-register-data/:id', async (ctx) => {
  const output = {
    register: null,
    statements: [],
  };


  const register = await Register.findById(ctx.params.id)
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
