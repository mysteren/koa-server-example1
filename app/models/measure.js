const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { ObjectExtend } = require('./../lib/functions');

autoIncrement.initialize(mongoose.connection);

const MeasureSchema = new mongoose.Schema({
  number: Number,
  name: {
    type: String,
    required: true,
  },
  print: {
    type: String,
    default: '',
    required: true,
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

MeasureSchema.methods.load = function load(input) {
  return ObjectExtend(this, input);
};


MeasureSchema.plugin(autoIncrement.plugin, { model: 'Measure', field: 'number', startAt: 1 });

module.exports = mongoose.model('Measure', MeasureSchema);
