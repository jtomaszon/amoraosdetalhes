(function() {
  
  var itemsFactory = function($http) {
    
    var factory = {};
    
    factory.getItems = function() {
      return $http.get('/api/items')
    };
    
    factory.getItem = function(itemName) {
      return $http.get('/api/items/' + itemName)
    };

    return factory;
    
  };
  
  itemsFactory.$inject = ['$http'];
  
  angular.module('Amor')
    .factory('itemsFactory', itemsFactory);
  
}());