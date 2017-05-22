angular.module('sellerService', [])


.factory('Seller', function($http) {


	var sellerFactory = {};

	sellerFactory.myProducts = function() {
		return $http.get('/api/myproducts');
	}

	sellerFactory.allOrders = function() {
		return $http.get('/api/myorders');
	}

	sellerFactory.addProduct = function(newProductData) {
		return $http.post('/api/addproduct', newProductData);
	}

	sellerFactory.markProductShipped = function(shippingData) {
		return $http.post('/api/updatestatus', shippingData)
	}

	return sellerFactory;
})