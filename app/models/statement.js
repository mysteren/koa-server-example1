const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

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
  act: Mixed,
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

StatementSchema.plugin(autoIncrement.plugin, { model: 'Statement', field: 'number', startAt: 1 });

module.exports = mongoose.model('Statement', StatementSchema);
