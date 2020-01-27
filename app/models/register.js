const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const { ObjectId, Mixed } = mongoose.Schema.Types;

const RegisterSchema = new mongoose.Schema({
  number: Number,
  date: {
    type: Date,
    required: true,
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

RegisterSchema.plugin(autoIncrement.plugin, { model: 'Register', field: 'number', startAt: 1 });

module.exports = mongoose.model('Register', RegisterSchema);
