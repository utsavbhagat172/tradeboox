angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 
						'buyerService', 'buyerCtrl', 'sellerService', 'sellerCtrl'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})