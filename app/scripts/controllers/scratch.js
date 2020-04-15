'use strict';

/**
 * @ngdoc function
 * @name scratchApp.controller:ScratchCtrl
 * @description
 * # ScratchCtrl
 * Controller of the scratchApp
 */
angular.module('scratchApp')
  .controller('ScratchCtrl', ['$window', '$scope', '$location', 'fileReader', function ($window, $scope, $location, fileReader) {

    var mainCtrl = this;
	mainCtrl.test = 'testing mainController';
    $scope.selectedScratch = null;

    var storageScratches = window.localStorage.getItem("scratches");
    //storageScratches = null;
    if (storageScratches == null) {
        storageScratches = [
            { check: false, name: "Quotes", title: "Quotes", scratches: 
                [{check: false, name: "plotly", title: "plotly"  }, 
                 {check: false, name: "bollingerbands", title: "bollinger bands"  }], 
            },
            {check: false, name: "Utility", title: "UTE Utility Development ",  scratches: []},
        ];
        localStorage.setItem("scratches", JSON.stringify(storageScratches));
        storageScratches = window.localStorage.getItem("scratches");
    }
    $scope.scratches =JSON.parse(storageScratches);
    $scope.scratchNames = [">> add new one "];
    for(var i=0; i < $scope.scratches.length; i++) {
        $scope.scratchNames.push($scope.scratches[i].name);
    }

    $scope.selectedScratch = $scope.scratchNames[0];

    $scope.saveJSON = function() {
         var jsonse = JSON.stringify($scope.scratches);
         var blob = new Blob([jsonse], {
          type: "application/json"
        });
        $scope.filename = $scope.filename || "my_json";
        saveAs(blob, $scope.filename + ".json");
    };

    $scope.deleteScratch = function(name, pageName) {
       console.log("delete " + name + " " +  pageName);

       function isPage(obj) {
           return  obj.name == pageName;
        }
         
        var  objIndex = $scope.scratches.findIndex(isPage); 
        var tmp = $scope.scratches[objIndex];
        var scratches = tmp.scratches;
        for(var i=0; i< scratches.length; i++ ) {
            console.log(scratches[i].name);
            if(scratches[i].name == name){
                scratches.splice(i, 1);
                localStorage.setItem("scratches", JSON.stringify($scope.scratches));
                break;
            }
        }
    };


    $scope.select = function(x) {
       $scope.name =  x.name;
       $scope.title=  x.title;
       console.log("select "  + $scope.name);
    };

    $scope.delete = function(index) {
       console.log("delete " + index);
       $scope.scratches.splice(index, 1);
       localStorage.setItem("scratches", JSON.stringify($scope.scratches));
    };

    $scope.update = function(x) {
        function isPage(obj) {
           return  obj.name == x.name;
        }
        
        var  objIndex = $scope.scratches.findIndex(isPage); 

        $scope.scratches[objIndex].name = x.name;
        $scope.scratches[objIndex].check = x.check;
        $scope.scratches[objIndex].context = x.context;

        localStorage.setItem("scratches", JSON.stringify($scope.scratches));
         
    }; 

    $scope.toggle = function(x) {
       console.log("toggle: " + x.name + " check: " + x.check);

       x.check = !x.check;
       $scope.update(x);
    };

     $scope.add = function() {
        var selectedScratch = $scope.selectedScratch;

        function isPage(obj) {
           return  obj.name == selectedScratch;
        }

        var pageName = $scope.addPageName.replace(/[\t ]/g, "_");
        if(selectedScratch == null || selectedScratch.includes(">> add")) {
            var x = {check: false, name: pageName, title: $scope.addPageName, scratches: []};

            $scope.scratches.push(x);
            localStorage.setItem("scratches", JSON.stringify($scope.scratches));
        }
        else {
            var objIndex = $scope.scratches.findIndex(isPage); 
            var scratch = { name: pageName, title: $scope.addPageName , check: false };
            $scope.scratches[objIndex].scratches.push(scratch);
            localStorage.setItem("scratches", JSON.stringify($scope.scratches));
                

        }
        
     };
 

   $scope.getFile = function () {
        fileReader.readAsText($scope.file, $scope)
           .then(function(result) {
           var jsonScratches =JSON.parse(result);
           $scope.scratches = jsonScratches; 

        });
    };
 
    $scope.$on("fileProgress", function(e, progress) {
        console.log("progress  " + progress.loaded + "/" + progress.total );
    });

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

    $scope.$watch('scratchSelectionText', function(v) {
        for (var i in $scope.scratches) {
            var scratch = $scope.scratches[i];
            if (scratch.name === v) {
                $scope.selectedScratch = scratch;
                break;
            }
        }
    });


 
  }]);
