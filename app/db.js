const mongoose = require('mongoose');
const config = require('config');

let dbc = config.mongodb;
let connectUrl;

if (config.util.getEnv('NODE_ENV') === 'test') {
  dbc = config.mongodb_test;
}

if (dbc.user && dbc.pass) {
  connectUrl = `mongodb://${dbc.user}:${dbc.pass}@${dbc.host}:${dbc.port}/${dbc.base}`;
} else {
  connectUrl = `mongodb://${dbc.host}:${dbc.port}/${dbc.base}`;
}

mongoose.Promise = global.Promise;

mongoose.connect(connectUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
