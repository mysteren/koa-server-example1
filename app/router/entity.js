const Router = require('koa-router');
const router = new Router();


const Entity = require('../models/entity');

/**
 * Get list
 */
router.get('/entity', async (ctx) => {
    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', 2);
    ctx.body = [
        {
            id: 1,
            name: 'sdgs',
            address: 'fsdfsd',
            phone: '4235235',
        },
        {
            id: 2,
            name: 'sdgs',
            address: 'fsdfsd',
            phone: '4235235',
        },
    ]
});

/**
 * Get one record
 */
router.get('/entity/:id', async (ctx) => {
    /**
     * @todo 
     */
    ctx.body = []
});

/**
 * Create record
 */
router.post('/entity', async (ctx) => {

    let entity = new Entity({...ctx.request.body});
    await entity.save();

    ctx.body = entity;
});


module.exports = router;