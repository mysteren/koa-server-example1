const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const MeasureSchema = new mongoose.Schema({
	_id: Number,
  name: String,
  object_code: Number,
  contract_number: Number,
  contract_date: Date,
  ivestor_id: {
    type: Number,
    required: false, 
    ref: 'Entity'
  },
  customer_id: {
    type: Number,
    required: true, 
    ref: 'Entity'
  },
  contractor_id: {
    type: Number,
    required: true, 
    ref: 'Entity'
  },
  subcontractors: [
    {
      type: Number,
      ref: 'Entity'
    }
  ],
  workgroups: [{
    name: String,
    works: [{
      work_id: {
        type: Number,
        ref: 'Work'
      },
      measure_id: {
        type: Number,
        ref: 'Work'
      },
      price: Number,
      count: Number,
      summ: Number
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

MeasureSchema.plugin(autoIncrement.plugin, {model: 'Measure', startAt: 1});

module.exports = mongoose.model('Project', MeasureSchema); 