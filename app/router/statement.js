const Router = require('koa-router');
const Statement = require('../models/statement');

const router = new Router();

// get all records
router.get('/Statement', async (ctx) => {
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

  const list = await Statement.find(filter, null, options).exec();
  const count = await Statement.countDocuments(filter, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/statement/:id', async (ctx) => {
  const record = await Statement.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/statement', async (ctx) => {
  try {
    const record = new Statement({ ...ctx.request.body });
    await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/statement/:id', async (ctx) => {
  try {
    let record = await Statement.findByIdAndUpdate(
      ctx.params.id,
      { ...ctx.request.body },
      { useFindAndModify: false, runValidators: true },
    );
    record = await Statement.findById(ctx.params.id);
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/statement/:id', async (ctx) => {
  const record = await Statement.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

/**
 * Custom queries
 */

// get project data
router.get('/get-statement-data/:id', async (ctx) => {
  const record = await Statement.findById(ctx.params.id)
    .populate([
      {
        path: 'project',
        populate: [
          'contractor',
          'customer',
          'ivestor',
          'work_groups.works.measures.measure',
        ],
      },
    ]);
  ctx.body = record;
});

module.exports = router;
