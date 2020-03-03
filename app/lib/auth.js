const jwt = require('jsonwebtoken');
const {
  Strategy: JwtStrategy,
  ExtractJwt,
} = require('passport-jwt');

const {
  Strategy: LocalStrategy,
} = require('passport-local');

const User = require('./../models/user');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'N9q;oBBHlXGDdIT',
};

const setJwtToken = (data) => jwt.sign(data, jwtOptions.secretOrKey);

const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
  if (payload && payload.id) {
    return done(null, payload);
  }
  return done(null, false);
});

const localStrategy = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
},
((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user || !user.checkPassword(password)) {
      return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
    }
    return done(null, user);
  });
}));

const isAdmin = (ctx) => ctx.state.user.permissions.includes('admin');

module.exports = {
  setJwtToken,
  jwtStrategy,
  localStrategy,
  isAdmin,
};
