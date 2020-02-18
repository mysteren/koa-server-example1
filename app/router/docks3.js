const Router = require('koa-router');
const DocKS3 = require('../models/docks3');
const Statement = require('../models/statement');

const router = new Router();

// get all records
router.get('/docks3', async (ctx) => {
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

  const list = await DocKS3.find(filter, null, options).exec();
  const count = await DocKS3.countDocuments(filter, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/docks3/:id', async (ctx) => {
  const record = await DocKS3.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/docks3', async (ctx) => {
  try {
    const record = new DocKS3({ ...ctx.request.body });
    await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/docks3/:id', async (ctx) => {
  try {
    let record = await DocKS3.findByIdAndUpdate(
      ctx.params.id,
      { ...ctx.request.body },
      { useFindAndModify: false, runValidators: true },
    );
    record = await DocKS3.findById(ctx.params.id);
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/docks3/:id', async (ctx) => {
  const record = await DocKS3.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

/**
 * Custom queries
 */

// get project data
router.get('/get-docks3-data/:id', async (ctx) => {
  const output = {
    docks3: null,
    // project: null,
    workStatements: {},
  };

  const docks3 = await DocKS3.findById(ctx.params.id)
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

  if (docks3) {
    output.docks3 = docks3;
    if (docks3.project) {
      const statements = await Statement.find({
        project: docks3.project._id,
        date: { $gte: docks3.start_date, $lte: docks3.end_date },
      });

      if (statements) {
        const works = {};
        for (const statement of statements) {
          if (works[statement.work] === undefined) {
            works[statement.work] = {};
          }

          const work = works[statement.work];
          const { measures } = statement;
          if (measures) {
            for (const mKey in measures) {
              if ({}.hasOwnProperty.call(measures, mKey)) {
                if (work[mKey] === undefined) {
                  work[mKey] = {
                    count: 0,
                  };
                }
                const measure = work[mKey];
                const value = parseFloat(measures[mKey]);
                measure.count += value;
              }
            }
          }
        }
        output.workStatements = works;
      }
    }
  }

  // if (output.register && output.register.project) {
  //   output.statements = await Statement.find({ project: output.register.project._id });
  // }
  ctx.body = output;
});

module.exports = router;
