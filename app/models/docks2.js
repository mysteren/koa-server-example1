const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
const { ObjectExtend } = require('../lib/functions');

const AutoIncrement = AutoIncrementFactory(mongoose.connection);

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

DocKS2Schema.plugin(AutoIncrement, {
  id: 'docks2_project_seq',
  inc_field: 'number',
  reference_fields: ['project'],
});

module.exports = mongoose.model('DocKS2', DocKS2Schema);
