'use strict';

/**
 * @ngdoc function
 * @name scratchApp.controller:CsvCtrl
 * @description
 * # CsvCtrl
 * Controller of the scratchApp
 */
angular.module('scratchApp')
  .controller('CsvCtrl', function ($scope, fileReader) {

   $scope.isNullOrEmpty = function (value) {
        return value == null || value === "";
   };

   $scope.refreshPlot = function (){
     $scope.plot(); 
   };

   $scope.processData = function(allText) {
        // split content based on new line
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];

        for ( var i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {
                var tarr = [];
                for ( var j = 0; j < headers.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            }
        }
        return lines;
        //$scope.data = lines;
    };
    $scope.parseCSV = function(s,sep) {
            // http://stackoverflow.com/questions/1155678/javascript-string-newline-character
            var universalNewline = /\r\n|\r|\n/g;
            var a = s.split(universalNewline);
            for(var i in a){
                for (var f = a[i].split(sep = sep || ","), x = f.length - 1, tl; x >= 0; x--) {
                    if (f[x].replace(/"\s+$/, '"').charAt(f[x].length - 1) == '"') {
                        if ((tl = f[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
                            f[x] = f[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
                          } else if (x) {
                        f.splice(x - 1, 2, [f[x - 1], f[x]].join(sep));
                      } else { 
                        f = f.shift().split(sep).concat(f);
                      }
                    } else {
                        f[x].replace(/""/g, '"');
                    }

                  } a[i] = f;
        }
        return a;
   };

  $scope.plot = function() {
          var lines= $scope.textSrc.split("\r\n"); //$scope.processData(result); //parseCSV(result, ",");
           $scope.vX = [];
           $scope.vY = [];
           var xcol = parseInt($scope.xCol);
           var ycol = parseInt($scope.yCol);
           var maxCol = xcol;
           if(ycol > maxCol) {
                   maxCol = ycol;
           }

           for(var i=0; i< lines.length; i++) {
                //$scope.fileProgress = {'loaded': i, 'total': lines.length};
                if (i%10 == 0) {
                    console.log("..readAsText.. " + i + " " + lines.length);
                }
                var cells = lines[i].split(",");
                if(cells.length > maxCol) {
                    var data = {};
                    if(cells[xcol].length > 0 && cells[ycol].length > 0 ) {
                        data.x = cells[xcol];
                        data.y = cells[ycol];
                        $scope.vX.push(data.x);
                        $scope.vY.push(data.y);
                    }
                }
           } 
    
           var trace2 = {
                x: $scope.vX,
                y: $scope.vY,
                type: 'scatter'
           };

           $scope.csvPlots = [ trace2,];

  };


   $scope.getFile = function () {
        $scope.percent= 0;
        $scope.textSrc = '';


        fileReader.readAsText($scope.file, $scope)
           .then(function(result) {
           $scope.textSrc = result;
           $scope.lines= $scope.parseCSV(result, ",");

 

        });
    };
 
    $scope.$on("fileProgress", function(e, progress) {
        $scope.percent= parseInt(progress.loaded * 100 / progress.total, 10);
        console.log("progress  " + $scope.percent+ "%" );
    });


  })

 .directive("ngFileSelect",function(){

    return {
        link: function($scope,el){
      
          el.bind("change", function(e){
          
            $scope.file = (e.srcElement || e.target).files[0];
            $scope.getFile();
      
          });
      
        }
    
    }; 
   })

 .factory("fileReader", function ($q, $log) {

        $log.log("fileReader"); 

        var onLoad = function(reader, deferred, scope) {
            return function () {
                $log.log("fileReader onload"); 
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
        var onLoadEnd = function(reader, scope) {
            return function (event) {
                $log.log("fileReader loadend"); 
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
        
  
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            reader.onloadend = onLoadEnd(reader, scope);
            return reader;
        };
 
        var readAsText = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsText(file);
             
            return deferred.promise;
        };
 
        return {
            readAsText: readAsText  
        };
    }
);
