'use strict';

angular.module('sampleFilters', [])
  .filter('total', function () {
    return function (orders) {
      var total = 0;
      orders.forEach(function (order){
        total += Number(order.price);
      });
      return Number(total).toFixed(2);
    };
  });
