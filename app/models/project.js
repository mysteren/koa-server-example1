const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const { ObjectId } = mongoose.Schema.Types;

const ProjectSchema = new mongoose.Schema({
  number: Number,
  name: String,
  object_code: Number,
  contract_number: Number,
  contract_date: Date,
  ivestor: {
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

ProjectSchema.plugin(autoIncrement.plugin, { model: 'Project', field: 'number', startAt: 1 });

ProjectSchema.statics.dataModification = function dataModification(input) {
  const data = input;

  data.work_groups = data.work_groups.map((group) => ({
    ...group,
    works: group.works.map((work) => ({
      ...work,
      measures: work.measures.map((measure) => ({
        ...measure,
        summ: (measure.price && measure.count) ? measure.price * measure.count : null,
      })),
    })),
  }));

  return data;

  /* return this.findByIdAndUpdate(
    id,
    { ...data },
    { useFindAndModify: false, runValidators: true },
  ); */
};

module.exports = mongoose.model('Project', ProjectSchema);
