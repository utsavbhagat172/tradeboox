angular.module('sellerCtrl', ['sellerService'])


.controller('SellerController', function(Seller, $location) {



	var vm = this;
	vm.orders=[];
	vm.myProducts = function() {
		Seller.myProducts().success(function(data){
			console.log(data);
			vm.myproducts=data;
		})
	}
	vm.myProducts();

	Seller.allOrders().success(function(data){
		vm.orders = data.orders;
		console.log(vm.orders)
	});

	vm.addProduct = function() {
		vm.processing = true;
		vm.message = '';
		Seller.addProduct(vm.newProductData).success(function(data) {
			vm.processing = false;
			vm.newProductData = {};
			vm.message = data.message;					
		});
	};
	vm.shippingData={};
	vm.markProductShipped = function(orderInfo, productInfo) {
		vm.shippingData = {order: orderInfo, productIndex: productInfo}
		console.log(vm.shippingData);
		Seller.markProductShipped(vm.shippingData).success(function(data){
			console.log(data);
			vm.shippingData = {};
			$location.path('/');
		})
	}
})
