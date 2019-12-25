const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const MeasureSchema = new mongoose.Schema({
	_id: Number,
	name: String,
}, {
	versionKey: false,
	toJSON: {
		transform: function(doc, ret) {
			ret.id = ret._id;
			delete ret._id;
		}
	}
});

MeasureSchema.plugin(autoIncrement.plugin, {model: 'Measure', startAt: 1});

module.exports = mongoose.model('Measure', MeasureSchema); 