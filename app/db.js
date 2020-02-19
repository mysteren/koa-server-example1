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
}).catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});

/* const db = mongoose.connection;

if (config.util.getEnv('NODE_ENV') === 'development') {
  db.on('connected', () => {
    console.log(`Db Connection open on ${connectUrl}`);
  });

  db.on('error', (e) => {
    console.error(e);
  });

  db.on('disconnected', () => {
    console.log('db connection disconnected');
  });
} */
