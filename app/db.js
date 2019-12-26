const mongoose = require('mongoose');
const config = require('config');

let connectUrl;

if (config.mongodb.user && config.mongodb.pass) {
  connectUrl = `mongodb://${config.mongodb.user}:${config.mongodb.pass}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.base}`;
} else {
  connectUrl = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.base}`;
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
