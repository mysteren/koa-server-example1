const Router = require('koa-router');
const Measure = require('../models/measure');

const router = new Router();

// get all records
router.get('/measure', async (ctx) => {
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

  const list = await Measure.find(filter, null, options).exec();
  const count = await Measure.countDocuments(filter, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/measure/:id', async (ctx) => {
  const record = await Measure.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/measure', async (ctx) => {
  try {
    const record = new Measure({ ...ctx.request.body });
    await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/measure/:id', async (ctx) => {
  try {
    let record = await Measure.findByIdAndUpdate(
      ctx.params.id,
      { ...ctx.request.body },
      { useFindAndModify: false, runValidators: true },
    );
    record = await Measure.findById(ctx.params.id);
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/measure/:id', async (ctx) => {
  const record = await Measure.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

module.exports = router;
