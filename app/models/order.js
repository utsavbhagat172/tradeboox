var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var OrderSchema = new Schema({

	creator: 		{ type: Schema.Types.ObjectId, ref: 'User' },
	products: 		[ { type: Schema.Types.ObjectId, ref: 'Product' }],
	products_info: 	[ {quantity:{ type: Number }, status: { type: String, default: 'Placed' }} ],
	sellers: 		[ { type: Schema.Types.ObjectId, ref: 'User' }],
	totalAmount: 	{type: Number},	
	address: 		{type: String},
	created: 		{ type: Date, default: Date.now}

});

module.exports = mongoose.model('Order', OrderSchema);