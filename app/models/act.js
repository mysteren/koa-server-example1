const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const { ObjectId, Mixed } = mongoose.Schema.Types;

const ActSchema = new mongoose.Schema({
  number: Number,
  date: {
    type: Date,
  },
  start_work_date: Date,
  end_work_date: Date,
  project: {
    type: ObjectId,
    required: false,
    ref: 'Project',
  },
  work: {
    type: ObjectId,
    require: true,
  },
  measures: Mixed,
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

ActSchema.plugin(autoIncrement.plugin, { model: 'Act', field: 'number', startAt: 1 });

module.exports = mongoose.model('Act', ActSchema);
