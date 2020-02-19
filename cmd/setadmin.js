/* eslint-disable no-console */

require('./../app/db');


const User = require('./../app/models/user');


const setAdmin = async () => {

  console.log('start');
  let admin = await User.findOne({ username: 'admin' });
  if (admin === null) {
    admin = new User();
  }
  admin.name = 'Администратор';
  admin.username = 'admin';
  admin.password = 'secret';
  admin.permissions = ['admin', 'superadmin'];
  await admin.save();
  console.log('done');
  process.exit();
};

setAdmin();
