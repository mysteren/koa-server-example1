const Router = require('koa-router');
const passport = require('koa-passport');
const { setJwtToken } = require('../lib/auth');

const router = new Router();

// create new record
router.post('/auth/login', async (ctx, next) => {
  await passport.authenticate('local', (err, user, data) => {
    if (user === false) {
      ctx.status = 403;
      ctx.body = data;
    } else {
      const payload = {
        id: user.id,
        name: user.name,
        v: user.__v,
        username: user.username,
        permissions: user.permissions,
        license: user.license,
      };
      const token = setJwtToken(payload);
      ctx.body = { token };
    }
  })(ctx, next);
});

module.exports = router;
