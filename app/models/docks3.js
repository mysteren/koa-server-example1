const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);
mongoose.set('useFindAndModify', false);

const { ObjectId } = mongoose.Schema.Types;

const DocKS3Schema = new mongoose.Schema({
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

DocKS3Schema.plugin(autoIncrement.plugin, { model: 'DocKS3', field: 'number', startAt: 1 });

module.exports = mongoose.model('DocKS3', DocKS3Schema);
