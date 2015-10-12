(function(){
  var Amor = angular.module('Amor', ['ngRoute']);

  Amor.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'ItemsController',
        templateUrl: 'app/views/home.html'
      })
      .when('/items/:itemName', {
        controller: 'ItemsController',
        templateUrl: 'app/views/item.html'
      })
      .otherwise( { redirectTo: '/' });
  });

}());