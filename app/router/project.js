const Router = require('koa-router');
const Project = require('../models/project');

const router = new Router();

// get all records
router.get('/project', async (ctx) => {
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

  const list = await Project.find(filter, null, options).exec();
  const count = await Project.count(filter, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/project/:id', async (ctx) => {
  const record = await Project.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/project', async (ctx) => {
  try {
    let record = new Project({ ...Project.dataModification(ctx.request.body) });
    record = await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/project/:id', async (ctx) => {

  // Project.beforeSave(ctx.request.body);

  try {
    await Project.findByIdAndUpdate(
      ctx.params.id,
      { ...Project.dataModification(ctx.request.body) },
      { useFindAndModify: false, runValidators: true },
    );

    // await Project.updateByData(ctx.params.id, ctx.request.body);
    ctx.body = await Project.findById(ctx.params.id);
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/project/:id', async (ctx) => {
  const record = await Project.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

/**
 * Custom queries
 */

// get project data
router.get('/get-project-data/:id', async (ctx) => {
  const record = await Project.findById(ctx.params.id)
    .populate([
      { path: 'work_groups.works.measures.measure' },
    ]);
  ctx.body = record;
});

module.exports = router;
