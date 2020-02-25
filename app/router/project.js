const Router = require('koa-router');
const passport = require('koa-passport');
const Project = require('../models/project');
const Statement = require('../models/statement');
const { dateToString } = require('../lib/format');

const router = new Router();

// get all records
router.get('/project',
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

    const list = await Project.find(filter, null, options);
    const count = await Project.count(filter, null, options);

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = list;
  });

// get one record by id
router.get('/project/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Project.findOne(filter);
    ctx.body = record;
  });

// create new record
router.post('/project',
  passport.authenticate('jwt'),
  async (ctx) => {
    const data = { ...ctx.request.body, user: ctx.state.user.id };
    const record = new Project();
    await record.load(data).save();
    ctx.body = record;
  });

// update record
router.put('/project/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    let record = await Project.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не найдена');
    }
    const data = ctx.request.body;
    record = await record.load(data).save();
    ctx.body = record;
  });

// delete record
router.delete('/project/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Project.findOne(filter);
    if (!record) {
      ctx.throw(404, 'Запись не найдена');
    }
    const result = record.delete();
    ctx.body = result;
  });

/**
 * Custom queries
 */

// GET:get-project-data
router.get('/get-project-data/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };
    const record = await Project.findOne(filter)
      .populate([
        { path: 'work_groups.works.measures.measure' },
      ]);
    ctx.body = record;
  });

// project-list-for-statement
router.get('/project-list-for-statement',
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

    const count = await Project.count(filter, null, options).exec();
    const list = await Project.find(filter, null, options).populate([
      'work_groups.works.measures.measure',
    ]);

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = list;
  });

// GET:get-project-daily-summary
router.get('/get-project-daily-summary/:id',
  passport.authenticate('jwt'),
  async (ctx) => {
    const startDate = new Date(ctx.request.query.startDate);
    const endDate = new Date(ctx.request.query.endDate);

    const output = {};

    const filter = {
      _id: ctx.params.id,
      user: ctx.state.user.id,
    };

    output.project = await Project.findOne(filter)
      .populate([
        { path: 'work_groups.works.measures.measure' },
      ]);

    if (!output.project) {
      throw Error('Запись не найдена');
    }

    const journal = {};
    if (output.project) {
      const statements = await Statement.find({ project: output.project._id });

      if (statements) {
        for (const statement of statements) {
          if (journal[statement.work] === undefined) {
            journal[statement.work] = {};
          }

          const work = journal[statement.work];

          if (statement.measures) {
            const { measures } = statement;
            for (const mKey in measures) {
              if ({}.hasOwnProperty.call(measures, mKey)) {
                if (work[mKey] === undefined) {
                  work[mKey] = {
                    dates: {},
                    rangeCount: 0,
                    totalCount: 0,
                  };
                }
                const measure = work[mKey];
                const value = parseFloat(measures[mKey]);
                const dateKey = dateToString(statement.date);
                const date = new Date(dateKey);
                measure.totalCount += value;
                if (measure.dates[dateKey]) {
                  measure.dates[dateKey] += value;
                } else {
                  measure.dates[dateKey] = value;
                }
                if (date <= endDate && date >= startDate) {
                  measure.rangeCount += value;
                }
              }
            }
          }
        }
      }
    }
    output.journal = journal;

    ctx.body = output;
  });

module.exports = router;
