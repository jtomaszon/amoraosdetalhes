(function () {

  'use strict';
  var ItemsController = function ($scope, $routeParams, itemsFactory) {

    var itemName = $routeParams.itemName;
    $scope.items = [];
    $scope.item = {};
    
    function init() {
      itemsFactory.getItems()
        .success(function (items) {
          $scope.items = items;
        })
        .error(function (data, status) {
          //handle error
        });

      if (typeof itemName !== 'undefined') {
        itemsFactory.getItem(itemName)
          .success(function (item) {
            $scope.item = item;
          })
          .error(function (data, status) {
            //handle error
          });
      }
      
    }
    
    init();
    
  };

  ItemsController.$inject = ['$scope', '$routeParams', 'itemsFactory'];
  
  angular.module('Amor')
    .controller('ItemsController', ItemsController);

}());