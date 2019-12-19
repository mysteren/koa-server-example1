const Router = require('koa-router');
const router = new Router();

entity = require('../models/entity');

/**
 * Get list
 */
router.get('/manual', async (ctx) => {
    ctx.body = []
});

/**
 * Get one record
 */
router.get('/manual/:id', async (ctx) => {
    /**
     * @todo 
     */
    ctx.body = []
});

/**
 * 
 */
router.post('/manual', async (ctx) => {
    ctx.body = 'create entity';
});


module.exports = router;