angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {

	$routeProvider

	.when('/', {
		templateUrl: 'app/views/pages/login.html'
	})
	.when('/login', {
		templateUrl: 'app/views/pages/login.html'
	})
	.when('/signup', {
		templateUrl: 'app/views/pages/signup.html'
	})
	.when('/buyer', {
		templateUrl: 'app/views/pages/buyer.html'
	})
	.when('/seller', {
		templateUrl: 'app/views/pages/seller.html'
	})
	.otherwise({redirectTo : '/'})
	
	$locationProvider.html5Mode(true);

})