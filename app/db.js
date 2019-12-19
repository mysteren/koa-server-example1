const mongoose = require('mongoose');
const config = require('config');

console.log(config);

if (config.mongodb.user && config.mongodb.pass) {
    const connectUrl = `mongodb://${config.mongodb.user}:${config.mongodb.pass}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.base}`   
} else {
    const connectUrl = `mongodb://${config.mongodb.user}:${config.mongodb.pass}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.base}`
}


mongoose.connect(connectUrl, {useNewUrlParser: true}).catch((e) => {
    console.error(e);
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log(`Db Connection open on ${connectUrl}`);
});

db.on('error', (e) => {
    console.error(e)
});

db.on('disconnected', () => {
    console.log('db connection disconnected');  
});

db.once('open', function() {
  // we're connected!
});