const Router = require('koa-router');
const router = new Router();

const Project = require('../models/project');

// get all records
router.get('/project', async (ctx) => {

	const q = ctx.request.query,
		filter = {}
		options = {};

	if (q._sort) {
		const sort = q._sort === 'id' ? '_id' : q._sort,
			order = q._order === 'DESC' ? -1 : 1;
		options.sort = {[sort]: order};
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
	/**
	 * @todo 
	 */
	//console.log(ctx.params.id);
	const query = Project.findById(ctx.params.id);
	const record = await query.exec();
	ctx.body = record;
});

// create new record
router.post('/project', async (ctx) => {

	let record = new Project({...ctx.request.body});
	await record.save();

	ctx.body = record;
});

// update record
router.put('/project/:id', async (ctx) => {
	const record = await Project.findByIdAndUpdate(ctx.params.id, {...ctx.request.body});
	ctx.body = record;
});

// delete record
router.delete('/project/:id', async (ctx) => {
	const record = await Project.findByIdAndDelete(ctx.params.id);
	ctx.body = record
});

module.exports = router;