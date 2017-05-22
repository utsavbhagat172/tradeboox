angular.module('buyerCtrl', ['buyerService'])


.controller('BuyerController', function(Buyer, socketio, $location) {


	var vm = this;

	Buyer.all()
	.success(function(data) {
		vm.products = data;
	});
	Buyer.allOrders().success(function(data){
		console.log(data)
		vm.orders = data.orders;
	})

	vm.totalAmount = 0;
	vm.cartproducts = [];
	vm.cartsellers = [];
	vm.cartproductsinfo = [];

	vm.addProductToCart = function(product) {
		vm.totalAmount +=product.price;
		vm.checkIndex = vm.cartproducts.indexOf(product);
		if(vm.checkIndex == -1){
			vm.cartproducts.push(product);
			vm.cartproductsinfo.push({quantity:1, status: 'Placed'});
			vm.sellerIndex = vm.cartsellers.indexOf(product.creator);
			if(vm.sellerIndex == -1){
				vm.cartsellers.push(product.creator);
			}

		}
		else{
			vm.cartproductsinfo[vm.checkIndex].quantity++;
		}
	}
	vm.address = ''
	vm.placeOrder = function() {
		if(vm.cartproducts && vm.address){
			vm.processing = true;
			vm.orderData = {products: vm.cartproducts, sellers: vm.cartsellers, products_info: vm.cartproductsinfo, totalAmount: vm.totalAmount, address: vm.address}
			vm.message = '';
			Buyer.placeOrder(vm.orderData).success(function(data) {
				vm.processing = false;
				vm.orderData = {};
				vm.totalAmount = 0;
				vm.cartproducts = [];
				vm.cartsellers = [];
				vm.cartproductsinfo = [];
				console.log(data)
				vm.message = data.message;		
				$location.path('/');	
			});
		}
	};



	socketio.on('product', function(data) {
		vm.products.push(data);
	})
})
