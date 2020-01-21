const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

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

MeasureSchema.plugin(autoIncrement.plugin, { model: 'Measure', field: 'number', startAt: 1 });

module.exports = mongoose.model('Measure', MeasureSchema);
