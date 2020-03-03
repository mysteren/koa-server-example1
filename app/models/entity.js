const mongoose = require('mongoose');
const { ObjectExtend } = require('./../lib/functions');

const EntitySchema = new mongoose.Schema({
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

module.exports = mongoose.model('Entity', EntitySchema);
