const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { ObjectExtend } = require('./../lib/functions');

autoIncrement.initialize(mongoose.connection);
mongoose.set('useFindAndModify', false);

const { ObjectId } = mongoose.Schema.Types;

const RegisterSchema = new mongoose.Schema({
  number: Number,
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  project: {
    type: ObjectId,
    required: true,
    ref: 'Project',
  },
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      const data = ret;
      data.id = ret._id;
      delete data._id;
      return data;
    },
  },
});

RegisterSchema.methods.load = function load(input) {
  return ObjectExtend(this, input);
};

RegisterSchema.plugin(autoIncrement.plugin, { model: 'Register', field: 'number', startAt: 1 });

module.exports = mongoose.model('Register', RegisterSchema);
