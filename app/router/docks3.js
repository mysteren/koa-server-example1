const Router = require('koa-router');
const passport = require('koa-passport');
const DocKS3 = require('../models/docks3');
const Statement = require('../models/statement');

const router = new Router();

// get all records
router.get('/docks3',
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

    const list = await DocKS3.find(filter, null, options).exec();
    const count = await DocKS3.countDocuments(filter, null, options).exec();

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = list;
  });

// get one record by id
router.get('/docks3/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await DocKS3.findOne(filter);
    ctx.body = record;
  });

// create new record
router.post('/docks3',
  passport.authenticate('jwt'),
  async (ctx) => {
    const data = { ...ctx.request.body, user: ctx.state.user.id };
    const record = new DocKS3();
    await record.load(data).save();
    ctx.body = record;
  });

// update record
router.put('/docks3/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    let record = await DocKS3.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не найдена');
    }
    const data = ctx.request.body;
    record = await record.load(data).save();
    ctx.body = record;
  });

// delete record
router.delete('/docks3/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await DocKS3.findOne(filter);
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
router.get('/get-docks3-data/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const output = {
      docks3: null,
      workStatements: {},
    };

    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };

    const docks3 = await DocKS3.findOne(filter)
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
    ctx.body = output;
  });

module.exports = router;
