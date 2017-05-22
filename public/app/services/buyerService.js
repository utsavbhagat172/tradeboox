angular.module('buyerService', [])


.factory('Buyer', function($http) {


	var buyerFactory = {};

	buyerFactory.all = function() {
		return $http.get('/api/products');
	}
	buyerFactory.allOrders = function() {
		return $http.get('/api/myorders');
	}

	buyerFactory.placeOrder = function(orderData) {
		return $http.post('/api/placeorder', orderData);
	}
	return buyerFactory;
})

.factory('socketio', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});