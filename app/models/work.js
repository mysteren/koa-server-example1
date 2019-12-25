const  mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const WorkSchema = new mongoose.Schema({
		_id: Number,
		name: String,
		measure_id: {
			type: Number,
			ref: 'Measure'
		}
	},{
		versionKey: false,
		toJSON: {
			transform: function(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			}
		}
	});

WorkSchema.plugin(autoIncrement.plugin, {model: 'Entity', startAt: 1});

module.exports = mongoose.model('Work', WorkSchema);