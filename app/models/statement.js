const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
const { ObjectExtend } = require('./../lib/functions');

const AutoIncrement = AutoIncrementFactory(mongoose.connection);
const { ObjectId, Mixed } = mongoose.Schema.Types;

const StatementSchema = new mongoose.Schema({
  number: Number,
  date: {
    type: Date,
    required: true,
  },
  start_work_date: {
    type: Date,
  },
  end_work_date: {
    type: Date,
  },
  sectors: [{
    type: ObjectId,
  }],
  project: {
    type: ObjectId,
    required: true,
    ref: 'Project',
  },
  work: {
    type: ObjectId,
    require: true,
  },
  measures: Mixed,
  act_hidden_work: Mixed,
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

StatementSchema.methods.load = function load(input) {
  return ObjectExtend(this, input);
};

StatementSchema.plugin(AutoIncrement, {
  id: 'stastement_project_seq',
  inc_field: 'number',
  reference_fields: ['project'],
});

module.exports = mongoose.model('Statement', StatementSchema);
