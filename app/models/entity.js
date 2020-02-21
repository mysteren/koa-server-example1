const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { ObjectExtend } = require('./../lib/functions');

autoIncrement.initialize(mongoose.connection);
mongoose.set('useFindAndModify', false);

const EntitySchema = new mongoose.Schema({
  number: Number,
  name: { type: String, required: true },
  address: String,
  phone: String,
  inn: String,
  okpo: String,
  members: [{
    name: { type: String, required: true },
    position: String,
    documents: [{
      name: {
        type: String,
        required: true,
      },
      for_doc: [{
        type: String,
      }],
    }],
  }],
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

EntitySchema.methods.load = function load(input) {
  return ObjectExtend(this, input);
};

EntitySchema.plugin(autoIncrement.plugin, { model: 'Entity', field: 'number', startAt: 1 });

module.exports = mongoose.model('Entity', EntitySchema);
