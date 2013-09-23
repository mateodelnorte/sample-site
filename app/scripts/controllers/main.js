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
      var Order = $resource(apiUrl + '/api/order/:orderId', { orderId:'@id' }, {
        place: { method: 'POST' }
      });
      var order = new Order({ items: $scope.items });
      order.$place(function (o) {
        var confirmationSent = false;
        var iv = setInterval(function checkForResults () {
          var OrderConfirmation = $resource(apiUrl + '/api/order/confirmation/:orderId', { orderId: '@id' });
          OrderConfirmation.get({ orderId: o.order.id }, function (c) {
            if ( ! confirmationSent && c.confirmationEmailText) {
              alert(c.confirmationEmailText);
              confirmationSent = true;
            }
            if (c.receiptEmailText) {
              alert(c.receiptEmailText);
              clearInterval(iv);
            }
          });
        }, 1000);
      });
    };
  });
