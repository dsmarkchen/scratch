'use strict';

/**
 * @ngdoc function
 * @name infernoApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the infernoApp
 */
angular.module('infernoApp')
  .controller('AboutCtrl', function ($scope, fileReader) {

   $scope.isNullOrEmpty = function (value) {
        return value == null || value === "";
   }


  })
;
