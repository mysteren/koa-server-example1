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

    if (q.date_start || q.date_end) {
      filter.contract_date = {};
      if (q.date_start) {
        filter.contract_date.$gte = q.date_start;
      }
      if (q.date_end) {
        filter.contract_date.$lte = q.date_end;
      }
    }

    const list = await Project.find(filter, null, options);
    const count = await Project.countDocuments(filter, null, options);

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
    // const result = record.delete();
    const result = await record.deleteWithRelations(record);
    if (!result) {
      ctx.throw(500, 'Ошибка удаления записи');
    }
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
        { path: 'contractor' },
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

                measure.rangeCount = Math.round(measure.rangeCount * 10000) / 10000;
                measure.totalCount = Math.round(measure.totalCount * 10000) / 10000;
              }
            }
          }
        }
      }
    }
    output.journal = journal;

    ctx.body = output;
  });

router.get('/work',
  passport.authenticate('jwt'),
  async (ctx) => {
    const q = ctx.request.query;
    const filter = {
      user: ctx.state.user.id,
    };

    if (q.project) {
      filter._id = q.project;
    }

    const options = {};
    const output = [];
    const Projects = await Project.find(filter, null, options);
    if (Array.isArray(Projects)) {
      Projects.forEach((project) => {
        if (Array.isArray(project.work_groups)) {
          project.work_groups.forEach((group) => {
            if (Array.isArray(group.works)) {
              group.works.forEach((work) => {
                output.push({
                  id: work.id,
                  name: work.name,
                });
              });
            }
          });
        }
      });
    }

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', output.length);

    ctx.body = output;
  });

// GET:projects-years
router.get('/projects-years',
  passport.authenticate('jwt'),
  async (ctx) => {
    // const q = ctx.request.query;
    const filter = {
      user: ctx.state.user.id,
    };
    const options = {
      sort: { contract_date: 'DESC' },
    };
    const select = {
      contract_date: true,
    };
    const output = [];
    const Projects = await Project.find(filter, select, options);
    if (Array.isArray(Projects)) {
      Projects.forEach((project) => {
        if (project.contract_date) {
          const year = project.contract_date.getFullYear();
          if (output.indexOf(year) === -1) {
            output.push(year);
          }
        }
      });
    }

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', output.length);

    ctx.body = output;
  });

module.exports = router;
