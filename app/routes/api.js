var User = require('../models/user');
var Product = require('../models/product');
var Order = require('../models/order');
var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username,
		tag: user.tag
	}, secretKey, {
		expiresIn: 900000000
	});


	return token;

}

module.exports = function(app, express, io) {


	var api = express.Router();


	api.post('/signup', function(req, res) {

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password,
			tag: 	req.body.tag
		});
		var token = createToken(user);
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'User has been created!',
				token: token
			});
		});
	});

	api.post('/login', function(req, res) {

		User.findOne({ 
			username: req.body.username
		}).select('name username password tag').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doenst exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					///// token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfuly login!",
						token: token
					});
				}
			}
		});
	});

	api.get('/products', function(req, res) {
		Product.find({}, function(err, products) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(products);
		});
	});


	api.use(function(req, res, next) {


		console.log("Somebody just came to our app!");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		// check if token exist
		if(token) {

			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user"});

				} else {

					//
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No Token Provided"});
		}

	});

	
	//======================== after login only ===============================================

	api.get('/myproducts', function(req, res) {
		Product.find({"creator":req.decoded.id}, function(err, products) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(products);
		});
	});

	api.post('/addproduct', function(req, res) {
		if(req.decoded.tag=='seller'){
			console.log(req.body)
			var product = new Product({
				creator: req.decoded.id,
				name: req.body.name,
				price: req.body.price,
				imgURL: req.body.imgURL,
				stock: req.body.stock
			});
			product.save(function(err) {
				if(err) {
					res.send(err);
					return;
				}
				io.emit('product', product)
				res.json({ 
					success: true,
					message: 'Product has been added!'
				});
			});
		}
		else{
			res.json({success: false, message: 'Not authorised to perform this task.'})
		}
	});


	api.get('/removeproduct', function(req, res) {
		Product.findOne({"_id":req.query.product_id}).remove({}, function(err) {
			if(err) {
				res.send(err);
				return;
			}
			res.json({ 
				success: true,
				message: 'Product has been removed!'
			});
		});
	});


	api.post('/placeorder', function(req, res) {
		if(req.decoded.tag=='buyer'){
			var order = new Order({
				creator: req.decoded.id,
				products: req.body.products,
				sellers: req.body.sellers,
				products_info: req.body.products_info,
				totalAmount: 	req.body.totalAmount,
				address: 		req.body.address
			});
			order.save(function(err) {
				if(err) {
					res.send(err);
					return;
				}

				res.json({ 
					success: true,
					message: 'Order has been placed!'
				});
			});
		}
		else{
			res.json({success: false, message: 'Not authorised to perform this task.'})
		}
	});

	api.get('/myorders', function(req, res) {
		if(req.decoded.tag=='buyer'){
			Order.find({"creator":req.decoded.id}).populate('products sellers').exec(function(err, results) {
				if(err) {
					res.send(err);
					return;
				}
				res.json({ 
					success: true,
					orders: results
				});
			});
		}
		else{
			Order.find({"sellers": { $in: [req.decoded.id]}}).populate('products sellers').exec(function(err, results) {
				if(err) {
					res.send(err);
					return;
				}
				else{
					res.json({ 
						success: true,
						orders: results
					});
				}
			});
		}
	});

	api.post('/updatestatus', function(req, res){
		if(req.decoded.tag == 'seller'){
			var setModifier = { $set: {} };
			setModifier.$set['products_info.' + req.body.productIndex + '.status'] = 'Shipped';
			Order.findOne({"_id":req.body.order._id}).update(setModifier).exec(function(err, order) {
				if(err) {
					res.send(err);
					return;
				}
				res.json({ 
					success: true,
					message: 'Status has been updated!'
				});
			});			
		}
		else{
			res.json({success: false, message: 'Not authorised to perform this task.'})
		}
	})

	api.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return api;


}