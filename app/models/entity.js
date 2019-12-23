
// const Schema = Mongo.Schema


// const EntityDocumentsSchema = new Schema('EntityDocumentsSchema', {
//     name: { type: 'string', required: true },
//     type: { type: 'number', default: 0 },
// });


// const EntityMembersSchema = new Schema('EntityMembersSchema', {
//     name: { type: 'string', required: true },
//     position: { type: 'string', required: false },
//     documents: [EntityDocumentsSchema]
// });
  
// const EntitySchema = new Schema('EntitySchema', {
//   name: { type: 'string', required: true },
//   address: { type: 'string', required: false },
//   phone: { type: 'string', required: false },
//   inn: { type: 'string', required: false },
//   opko: { type: 'string', required: false },
//   members: [EntityMembersSchema],
// });

// const Entity = mongolass.model('Entity', EntitySchema)
const  mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const EntitySchema = new mongoose.Schema({
    _id: Number,
    name: String,
    address: String,
    phone: String,
    inn: String,
    opko: String,
    members: [{
        //_id: Number,
        name: String,
        position: String,
        documents: [{
            //_id: Number,
            name: String,
            for_doc: [String]
        }]
    }]
});

EntitySchema.plugin(autoIncrement.plugin, {model: 'Entity', startAt: 1});

EntitySchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Entity', EntitySchema);