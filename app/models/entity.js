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
}, {
	versionKey: false,
	toJSON: {
		transform: function(doc, ret) {
			ret.id = ret._id;
			delete ret._id;
		}
	}
});

EntitySchema.plugin(autoIncrement.plugin, {model: 'Entity', startAt: 1});

module.exports = mongoose.model('Entity', EntitySchema);