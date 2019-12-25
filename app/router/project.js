const Router = require('koa-router');
const router = new Router();

// get all records
router.get('/project', async (ctx) => {

	ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
	ctx.set('X-Total-Count', 0);
	ctx.body = []
});


module.exports = router;