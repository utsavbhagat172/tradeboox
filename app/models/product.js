var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ProductSchema = new Schema({

	creator: 	{ type: Schema.Types.ObjectId, ref: 'User' },
	name: 		{type: String},
	price: 		{type: Number},
	imgURL: 	{type: String},
	stock: 		{type: Number},
	created: 	{ type: Date, default: Date.now}

});

module.exports = mongoose.model('Product', ProductSchema);