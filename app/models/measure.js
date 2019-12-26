const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const MeasureSchema = new mongoose.Schema({
  _id: Number,
  name: String,
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

MeasureSchema.plugin(autoIncrement.plugin, { model: 'Measure', startAt: 1 });

module.exports = mongoose.model('Measure', MeasureSchema);
