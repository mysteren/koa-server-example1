const Router = require('koa-router');
const Work = require('../models/work');

const router = new Router();

// get all records
router.get('/work', async (ctx) => {
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

  const list = await Work.find(null, null, options).exec();
  const count = await Work.count(null, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/work/:id', async (ctx) => {
  const record = await Work.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/work', async (ctx) => {
  try {
    let record = new Work({ ...ctx.request.body });
    record = await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/work/:id', async (ctx) => {
  try {
    let record = await Work.findByIdAndUpdate(
      ctx.params.id,
      { ...ctx.request.body },
      { useFindAndModify: false },
    );
    record = await Work.findById(ctx.params.id);
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/work/:id', async (ctx) => {
  const record = await Work.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

module.exports = router;
