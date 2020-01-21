const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);
mongoose.set('useFindAndModify', false);

const EntitySchema = new mongoose.Schema({
  number: Number,
  name: { type: String, required: true },
  address: String,
  phone: String,
  inn: String,
  opko: String,
  members: [{
    // _id: Number,
    name: { type: String, required: true },
    position: String,
    documents: [{
      // _id: Number,
      name: { type: String, required: true },
      for_doc: [String],
    }],
  }],
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

EntitySchema.plugin(autoIncrement.plugin, { model: 'Entity', field: 'number', startAt: 1 });

module.exports = mongoose.model('Entity', EntitySchema);
