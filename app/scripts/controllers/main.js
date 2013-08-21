'use strict';

angular.module('sampleSiteApp')
  .controller('MainCtrl', function ($scope, $resource) {

    $scope.items = [];
    $scope.newItem = { };

    $scope.additem = function () {
      $scope.items.push($scope.newItem);
      $scope.newItem = { };
    };

    $scope.removeitem = function (index) {
      $scope.items.splice(index, 1);
    };

    $scope.submitorder = function () {
      var Order = $resource('/api/order/:orderId', { orderId:'@id' }, {
        place: { method: 'POST' }
      });
      var order = new Order({ items: $scope.items });
      order.$place(function (o) {
        setInterval(function checkForResults () {
          var OrderConfirmation = $resource('/api/order/confirmation', { orderId: '@id' });
          OrderConfirmation.$get({ orderId: o.order.id }, function (c) {
            console.log(c);
          });
        }, 1000);
      });
    };
  });
