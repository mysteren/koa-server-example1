const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const ProjectSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  object_code: Number,
  contract_number: Number,
  contract_date: Date,
  ivestor_id: {
    type: Number,
    required: false,
    ref: 'Entity',
  },
  customer_id: {
    type: Number,
    required: true,
    ref: 'Entity',
  },
  contractor_id: {
    type: Number,
    required: true,
    ref: 'Entity',
  },
  subcontractors: [
    {
      type: Number,
      ref: 'Entity',
    },
  ],
  quality_control_services: [
    {
      type: Number,
      ref: 'Entity',
    },
  ],
  start_date: Date,
  end_date: Date,
  workgroups: [{
    name: String,
    works: [{
      work_id: {
        type: Number,
        ref: 'Work',
      },
      measures: [{
        measure_id: {
          type: Number,
          ref: 'Measure',
        },
        price: Number,
        count: Number,
        summ: Number,
      }],
    }],
  }],
}, {
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      const data = ret;
      data.id = ret._id;
      delete data._id;
      return data;
    },
  },
});

ProjectSchema.plugin(autoIncrement.plugin, { model: 'Project', startAt: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
