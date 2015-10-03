var Amor = angular.module('Amor', []);
Amor.controller('ItemsController', function($scope, $http) {
    $http.get('/data.json')
      .then(function(res){
        $scope.items = res.data;
      })
  });
