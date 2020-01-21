const Router = require('koa-router');
const Act = require('../models/act');

const router = new Router();

// get all records
router.get('/act', async (ctx) => {
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

  const list = await Act.find(filter, null, options).exec();
  const count = await Act.countDocuments(filter, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/act/:id', async (ctx) => {
  const record = await Act.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/act', async (ctx) => {
  try {
    const record = new Act({ ...ctx.request.body });
    await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/act/:id', async (ctx) => {
  try {
    let record = await Act.findByIdAndUpdate(
      ctx.params.id,
      { ...ctx.request.body },
      { useFindAndModify: false, runValidators: true },
    );
    record = await Act.findById(ctx.params.id);
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/act/:id', async (ctx) => {
  const record = await Act.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

module.exports = router;
