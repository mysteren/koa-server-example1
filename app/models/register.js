const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
const { ObjectExtend } = require('./../lib/functions');

const AutoIncrement = AutoIncrementFactory(mongoose.connection);
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

RegisterSchema.plugin(AutoIncrement, {
  id: 'register_project_seq',
  inc_field: 'number',
  reference_fields: ['project'],
});

// RegisterSchema.plugin(autoIncrement.plugin, { model: 'Register', field: 'number', startAt: 1 });

module.exports = mongoose.model('Register', RegisterSchema);
