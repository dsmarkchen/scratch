'use strict';

/**
 * @ngdoc function
 * @name scratchApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the scratchApp
 */
angular.module('scratchApp')
  .controller('AboutCtrl', function ($scope, fileReader) {

   $scope.isNullOrEmpty = function (value) {
        return value == null || value === "";
   }


  })
;
