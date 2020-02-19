const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

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

DocKS2Schema.plugin(autoIncrement.plugin, { model: 'DocKS2', field: 'number', startAt: 1 });

module.exports = mongoose.model('DocKS2', DocKS2Schema);