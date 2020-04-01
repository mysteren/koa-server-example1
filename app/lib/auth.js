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
    User.findById(payload.id).exec((err, user) => {
      if (err) {
        return done(err);
      } else if (!user.permissions.includes('admin') && (!user || !user.checkLicense())) {
        return done(null, false, { message: 'Нет такого пользователя или лицензия пользователя закончилась.' });
      } else {
        return done(null, payload);
      }
    });
  }
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
    } else if (!user) {
      return done(null, false, { message: 'Нет такого пользователя' });
    } else if (!user.checkPassword(password)) {
      return done(null, false, { message: 'Неправильный пароль' });
    } else if (!user.permissions.includes('admin') && !user.checkLicense()) {
      return done(null, false, { message: 'Истёк срок лицензии' });
    } else {
      return done(null, user);
    }
  });
}));

const isAdmin = (ctx) => ctx.state.user.permissions.includes('admin');

module.exports = {
  setJwtToken,
  jwtStrategy,
  localStrategy,
  isAdmin,
};
