'use strict';

/**
 * @ngdoc function
 * @name scratchApp.controller:ScratchCtrl
 * @description
 * # ScratchCtrl
 * Controller of the scratchApp
 */
angular.module('scratchApp')
  .controller('ScratchCtrl', ['$window', '$scope', '$location', function ($window, $scope, $location) {

    $scope.$watch('scratchSelectionText', function(v) {
        for (var i in $scope.scratches) {
            var scratch = $scope.scratches[i];
            if (scratch.name === v) {
                $scope.selectedScratch = scratch;
                break;
            }
        }
    });


    var mainCtrl = this;
	mainCtrl.test = 'testing mainController';

    var storageScratches = window.localStorage.getItem("scratches");
    //storageScratches = null;
    if (storageScratches == null) {
        storageScratches = [
            { id:0, check: false, name: "Quotes",   scratches: 
                [{id: 11, check: false, name: "plotly",   }, 
                 {id: 12, check: false, name: "bollinger bands",  }], 
            },
            {id:1, check: false, name: "Utility",  scratches: []},
        ];
        localStorage.setItem("scratches", JSON.stringify(storageScratches));
        storageScratches = window.localStorage.getItem("scratches");
    }
    $scope.scratches =JSON.parse(storageScratches);

    $scope.deleteScratch = function(name, pageName) {
       console.log("delete " + name + " " +  pageName);

       function isPage(obj) {
           return  obj.id == $scope.page;
        }
         
        var  objIndex = $scope.scratches.findIndex(isPage); 
        var tmp = $scope.scratches[objIndex];
        var scratches = tmp.scratches;
        for(var i=0; i< scratches.length; i++ ) {
            console.log(scratches[i].name);
        }
    }


    $scope.select = function(x) {
       $scope.page = x.id; 
       $scope.name =  x.name;
       $scope.input = x.input; 
       console.log("select "  + $scope.name);
            
    }
    $scope.delete = function(index) {
       console.log("delete " + index);
       $scope.scratches.splice(index, 1);
       localStorage.setItem("scratches", JSON.stringify($scope.scratches));
    }

    $scope.update = function(x) {
        function isPage(obj) {
           return  obj.id == x.id;
        }
        
        var  objIndex = $scope.scratches.findIndex(isPage); 

        $scope.scratches[objIndex].name = x.name;
        $scope.scratches[objIndex].check = x.check;

        localStorage.setItem("scratches", JSON.stringify($scope.scratches));
         
    } 

    $scope.toggle = function(x) {
       console.log("toggle: " + x.name + " id: " + x.id + " check: " + x.check);

       x.check = !x.check;
       $scope.update(x);
    }

     $scope.add = function() {

        var x = { name: $scope.addPageTitle, scratches: ""};

        $scope.scratches.push(x) 
       
        localStorage.setItem("scratches", JSON.stringify($scope.scratches));
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
