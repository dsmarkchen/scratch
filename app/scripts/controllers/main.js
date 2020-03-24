'use strict';

/**
 * @ngdoc function
 * @name infernoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the infernoApp
 */
angular.module('infernoApp')
 .filter('split', function() {
   return function(input) {
  var delimiter = /([!,.;?-])/g;
  var line_index = 0;
  var res = input.split(delimiter);
  var temp = "";
  var sum = "";
  var sum2 = "";
  res.forEach(split_commas);

  console.log("line_index:" + line_index);
  return sum;

  function split_that(item) {
    if(item == "that" || item == "where" || item == "when" || item == "who" || item == "which") { 
        sum2 +="\n "
        sum2 += item;
        return;
    }
    sum2 += item;
  }

  function split_commas(item) {
    temp += item;
    if(item.length > 52) {
        /* sum+='##NEED_SPLIT##'; */
        var delimiter2 = /(that|where|which|when|who)/g;
        var res2 = temp.split(delimiter2);
        res2.forEach(split_that);
        sum += sum2;
        temp = "";
        return;
    }

    sum += item; 
    if(sum.endsWith('--') && item== "-" || item== "?" || item== ";" || item== "." || item=="!" || item==",") {
        sum += "\n";
        temp = "";
    }


  }  
}}) 
  .controller('MainCtrl', ['$window', '$scope', '$location', function ($window, $scope, $location) {

    var mainCtrl = this;
	mainCtrl.test = 'testing mainController';

    try{
        $scope.pages = JSON.parse(window.localStorage.getItem("pages"));
      //  throw "";
    }
    catch{

        var pages = [
            {id:0, check: false, name: "Lunchmeat",  input:""},
            {id:1, check: false, name: "Bread",  input:"2 pieces"},
            {id:2, check: false, name: "Milk",  input:"1 cup"},
            {id:3, check: false, name: "Mustard",  input:""},
            {id:4, check: false, name: "Cheese",  input:""}
        ];
        localStorage.setItem("pages", JSON.stringify(pages));
        $scope.pages =JSON.parse(window.localStorage.getItem("pages"));
    }


    if($scope.pages == "undefined" || $scope.pages == null){
        var pages = [
            {id:0, check: false, name: "Lunchmeat",  input:""},
            {id:1, check: false, name: "Bread",  input:"2 pieces"},
            {id:2, check: false, name: "Milk",  input:"1 cup"},
            {id:3, check: false, name: "Mustard",  input:""},
            {id:4, check: false, name: "Cheese",  input:""}
       ];
       localStorage.setItem("pages", JSON.stringify(pages));
        $scope.pages =JSON.parse(window.localStorage.getItem("pages"));
    }

    $scope.select = function(x) {

       $scope.page = x.id; 
       $scope.name =  x.name;
       $scope.input = x.input; 
       console.log("select "  + $scope.name);
            
    }
    $scope.delete = function(index) {
       console.log("delete " + index);
       $scope.pages.splice(index, 1);
       localStorage.setItem("pages", JSON.stringify($scope.pages));
    }
    $scope.update = function() {
        var  objIndex = $scope.pages.findIndex((obj => obj.id == $scope.page)); 

        $scope.pages[objIndex].name = $scope.name;

        localStorage.setItem("pages", JSON.stringify($scope.pages));
         
    } 
    $scope.toggle = function(x) {
       console.log("toggle" + x.id);
       x.check = !x.check;
       $scope.update();
    }

     $scope.add = function() {

        var x = { name: $scope.addPageTitle, input: ""};

        $scope.pages.push(x) 
       
        localStorage.setItem("pages", JSON.stringify($scope.pages));
     }
 

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };


    function getIEVersion() {
      var sAgent = window.navigator.userAgent;
      var Idx = sAgent.indexOf("MSIE");

      // If IE, return version number.
      if (Idx > 0) {
        return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
      }
      // If IE 11 then look for Updated user agent string.
      else if (!!navigator.userAgent.match(/Trident\/7\./))  {
        return 11;
      }
      else {
        return 0; //It is not IE
      }
    }
    $scope.ie = getIEVersion(); 
    
  }]);
