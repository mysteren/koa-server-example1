const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { ObjectExtend } = require('./../lib/functions');

autoIncrement.initialize(mongoose.connection);
mongoose.set('useFindAndModify', false);

const { ObjectId } = mongoose.Schema.Types;

const DocKS2Schema = new mongoose.Schema({
  number: Number,
  date: {
    type: Date,
    required: true,
  },
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

DocKS2Schema.methods.load = function load(input) {
  return ObjectExtend(this, input);
};

DocKS2Schema.plugin(autoIncrement.plugin, { model: 'DocKS2', field: 'number', startAt: 1 });

module.exports = mongoose.model('DocKS2', DocKS2Schema);
