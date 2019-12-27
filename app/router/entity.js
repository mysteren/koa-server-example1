const Router = require('koa-router');
const Entity = require('../models/entity');

const router = new Router();

// get all records
router.get('/entity', async (ctx) => {
  const q = ctx.request.query;
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

  const list = await Entity.find(null, null, options).exec();

  const count = await Entity.countDocuments(null, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/entity/:id', async (ctx) => {
  const record = await Entity.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/entity', async (ctx) => {
  try {
    let record = new Entity({ ...ctx.request.body });
    record = await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/entity/:id', async (ctx) => {
  try {
    let record = await Entity.findByIdAndUpdate(
      ctx.params.id,
      { ...ctx.request.body },
      { useFindAndModify: false },
    );
    record = await Entity.findById(ctx.params.id);
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/entity/:id', async (ctx) => {
  const record = await Entity.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

module.exports = router;
