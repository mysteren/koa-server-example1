const mongoose = require('mongoose');
const config = require('config');

let dbc = config.mongodb;
let connectUrl;

console.log(config.util.getEnv('NODE_ENV'));

if (config.util.getEnv('NODE_ENV') === 'test') {
  dbc = config.mongodb_test;
}

if (dbc.user && dbc.pass) {
  connectUrl = `mongodb://${dbc.user}:${dbc.pass}@${dbc.host}:${dbc.port}/${dbc.base}`;
} else {
  connectUrl = `mongodb://${dbc.host}:${dbc.port}/${dbc.base}`;
}

mongoose.Promise = global.Promise;

mongoose.connect(connectUrl, { useNewUrlParser: true }).catch((e) => {
  console.error(e);
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`Db Connection open on ${connectUrl}`);
});

db.on('error', (e) => {
  console.error(e);
});

db.on('disconnected', () => {
  console.log('db connection disconnected');
});
