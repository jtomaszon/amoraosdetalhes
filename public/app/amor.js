var Amor = angular.module('Amor', []);

Amor.filter('numberFixedLen', function () {
    return function (n, len) {
      var num = parseInt(n, 10);
      len = parseInt(len, 10);
      if (isNaN(num) || isNaN(len)) return n;
      num = ''+num;
      while (num.length < len) {
        num = '0'+num;
      }
      return num;
      }
  })

Amor.controller('ItemsController', function($scope, $http) {
    $http.get('/data.json')
      .then(function(res){
        $scope.items = res.data;
      })
  });
