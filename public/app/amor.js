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

  
  Amor.directive('footer', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "app/views/footer.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    };
});
}());