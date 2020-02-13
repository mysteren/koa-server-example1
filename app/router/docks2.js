const Router = require('koa-router');
const DocKS2 = require('../models/docks2');
const Statement = require('../models/statement');

const router = new Router();

// get all records
router.get('/docks2', async (ctx) => {
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

  const list = await DocKS2.find(filter, null, options).exec();
  const count = await DocKS2.countDocuments(filter, null, options).exec();

  ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
  ctx.set('X-Total-Count', count);
  ctx.body = list;
});

// get one record by id
router.get('/docks2/:id', async (ctx) => {
  const record = await DocKS2.findById(ctx.params.id);
  ctx.body = record;
});

// create new record
router.post('/docks2', async (ctx) => {
  try {
    const record = new DocKS2({ ...ctx.request.body });
    await record.save();
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// update record
router.put('/docks2/:id', async (ctx) => {
  try {
    let record = await DocKS2.findByIdAndUpdate(
      ctx.params.id,
      { ...ctx.request.body },
      { useFindAndModify: false, runValidators: true },
    );
    record = await DocKS2.findById(ctx.params.id);
    ctx.body = record;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

// delete record
router.delete('/docks2/:id', async (ctx) => {
  const record = await DocKS2.findByIdAndDelete(ctx.params.id);
  ctx.body = record;
});

/**
 * Custom queries
 */

// get project data
router.get('/get-docks2-data/:id', async (ctx) => {
  const output = {
    docks2: null,
    // project: null,
    workStatements: {},
  };

  const docks2 = await DocKS2.findById(ctx.params.id)
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

  if (docks2) {
    output.docks2 = docks2;
    if (docks2.project) {
      const statements = await Statement.find({
        project: docks2.project._id,
        date: { $gte: docks2.start_date, $lte: docks2.end_date },
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
  // ctx.body = output;
  // if (output.register && output.register.project) {
  //   output.statements = await Statement.find({ project: output.register.project._id });
  // }
  ctx.body = output;
});

module.exports = router;
