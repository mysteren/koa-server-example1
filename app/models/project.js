const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
const { ObjectExtend } = require('./../lib/functions');

const AutoIncrement = AutoIncrementFactory(mongoose.connection);
const { ObjectId } = mongoose.Schema.Types;

const ProjectSchema = new mongoose.Schema({
  number: Number,
  name: String,
  object_code: String,
  contract_date: Date,
  investor: {
    type: ObjectId,
    required: false,
    ref: 'Entity',
  },
  customer: {
    type: ObjectId,
    required: true,
    ref: 'Entity',
  },
  contractor: {
    type: ObjectId,
    required: true,
    ref: 'Entity',
  },
  subcontractors: [
    {
      type: ObjectId,
      ref: 'Entity',
    },
  ],
  quality_control_services: [
    {
      type: ObjectId,
      ref: 'Entity',
    },
  ],
  start_date: Date,
  end_date: Date,
  sectors: [{
    name: String,
    description: String,
  }],
  work_groups: [{
    name: String,
    works: [{
      name: String,
      measures: [{
        measure: {
          type: ObjectId,
          ref: 'Measure',
        },
        price: Number,
        count: Number,
        summ: Number,
      }],
    }],
  }],
  tax: {
    type: Number,
    default: 0.2,
  },
  reserve_summ: {
    type: Number,
    default: 0.05,
  },
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  documents: [{
    name: String,
  }],
  materials: [{
    name: String,
  }],
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

const dataModification = (input) => {
  const data = input;
  data.work_groups = Array.isArray(data.work_groups) ? data.work_groups.map((group) => ({
    ...group,
    works: Array.isArray(group.works) ? group.works.map((work) => ({
      ...work,
      measures: Array.isArray(work.measures) ? work.measures.map((measure) => ({
        ...measure,
        summ: (measure.price && measure.count) ? measure.price * measure.count : null,
      })) : [],
    })) : [],
  })) : [];
  return data;
};

ProjectSchema.methods.load = function load(input) {
  return ObjectExtend(this, dataModification(input));
};

ProjectSchema.plugin(AutoIncrement, {
  id: 'project_seq',
  inc_field: 'number',
});

module.exports = mongoose.model('Project', ProjectSchema);
