const Router = require('koa-router');
const router = new Router();


const Entity = require('../models/entity');

// get all records
router.get('/entity', async (ctx) => {

	console.log(ctx.request.query);

	const q = ctx.request.query,
		options = {};
	if (q._sort) {
		const sort = q._sort === 'id' ? '_id' : q._sort,
			order = q._order === 'DESC' ? -1 : 1;
		options.sort = {[sort]: order}    ;
	}

	options.skip = Number(q._start);

	if (q._end) {
		options.limit = q._end - options.skip;
	}

	const list = await Entity.find(null, null, options).exec();

	const count = await Entity.count(null, null, options).exec();

	ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
	ctx.set('X-Total-Count', count);
	ctx.body = list
});

// get one record by id
router.get('/entity/:id', async (ctx) => {
	/**
	 * @todo 
	 */
	//console.log(ctx.params.id);
	const query = Entity.findById(ctx.params.id);
	const record = await query.exec();
	ctx.body = record;
});

// create new record
router.post('/entity', async (ctx) => {

	let entity = new Entity({...ctx.request.body});
	await entity.save();

	ctx.body = entity;
});

// update record
router.put('/entity/:id', async (ctx) => {
	const entity = await Entity.findByIdAndUpdate(ctx.params.id, {...ctx.request.body});
	ctx.body = entity;
});

// delete record
router.delete('/entity/:id', async (ctx) => {
	const entity = await Entity.findByIdAndDelete(ctx.params.id);
	ctx.body = entity
});

module.exports = router;