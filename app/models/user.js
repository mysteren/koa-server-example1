const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ObjectExtend } = require('../lib/functions');

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  passwordHash: String,
  salt: String,
  permissions: [String],
  license: Date,
},
{
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      const data = ret;
      data.id = ret._id;
      delete data._id;
      delete data.passwordHash;
      delete data.salt;
      return data;
    },
  },
});

UserSchema.virtual('password')
  .set(function set(password) {
    this._plainPassword = password;
    if (password) {
      this.salt = bcrypt.genSaltSync(8);
      this.passwordHash = bcrypt.hashSync(password, this.salt);
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function get() { return this._plainPassword; });

UserSchema.methods.load = function load(input) {
  const data = input;
  return ObjectExtend(this, data);
};

UserSchema.methods.checkPassword = function checkPassword(password) {
  if (password && this.passwordHash) {
    return bcrypt.compareSync(password, this.passwordHash);
  }
  return false;
};

UserSchema.methods.checkLicense = function checkLicense() {
  if (this.license) {
    const now = new Date();
    return Date.parse(now) < Date.parse(this.license);
  }
  return false;
};

module.exports = mongoose.model('User', UserSchema);
