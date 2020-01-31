const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);
mongoose.set('useFindAndModify', false);

const { ObjectId } = mongoose.Schema.Types;

const RegisterSchema = new mongoose.Schema({
  number: Number,
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

RegisterSchema.plugin(autoIncrement.plugin, { model: 'Register', field: 'number', startAt: 1 });

module.exports = mongoose.model('Register', RegisterSchema);
