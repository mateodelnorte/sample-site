'use strict';

angular.module('totalFilterProvider')
  .filter('total', function (orders) {
    var total = 0;
    orders.forEach(function (order){
      total += order.price;
    });
    return total;
  });
