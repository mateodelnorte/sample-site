'use strict';

angular.module('sampleSiteApp')
  .controller('MainCtrl', function ($scope) {

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
      alert('submitting order');
    }
  });
