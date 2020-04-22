const mongoose = require('mongoose');
const { ObjectExtend } = require('../lib/functions');

const { ObjectId } = mongoose.Schema.Types;

const MeasureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  print: {
    type: String,
    default: '',
    required: true,
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

MeasureSchema.methods.load = function load(input) {
  return ObjectExtend(this, input);
};

module.exports = mongoose.model('Measure', MeasureSchema);
