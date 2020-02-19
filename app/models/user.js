const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bcrypt = require('bcryptjs');

autoIncrement.initialize(mongoose.connection);

// const { Array } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  passwordHash: String,
  salt: String,
  permissions: [String],
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

UserSchema.methods.load = function load({
  name,
  username,
  password,
  permissions,
}) {
  this.name = name;
  this.username = username;

  if (permissions) {
    this.permissions = permissions;
  }

  if (password) {
    this.password = password;
  }

  return this;
};

UserSchema.methods.checkPassword = function checkPassword(password) {
  if (password && this.passwordHash) {
    return bcrypt.compareSync(password, this.passwordHash);
  }
  return false;
};

module.exports = mongoose.model('User', UserSchema);
