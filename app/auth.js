const passport = require('koa-passport');
const {
  jwtStrategy,
  localStrategy,
} = require('./lib/auth');

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(async (user, done) => {
  try {
    done(null, JSON.parse(user));
  } catch (err) {
    done(err);
  }
});

passport.use('jwt', jwtStrategy);
passport.use('local', localStrategy);
