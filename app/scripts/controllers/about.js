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



 $scope.getFile = function () {
        $scope.progress = 0;
        $scope.textSrc = '';

        localStorage.setItem("totalSymbols", $scope.totalSymbols);
        localStorage.setItem("totalLHs", $scope.totalLHs);

        fileReader.readAsText($scope.file, $scope)
           .then(function(result) {
           $scope.textSrc = result;
           $scope.lines= $scope.parseCSV(result, ",");

           var lines= result.split("\r\n"); //$scope.processData(result); //parseCSV(result, ",");
           $scope.vX = [];
           $scope.vY = [];
           for(var i=0; i< lines.length; i++) {
                var cells = lines[i].split(",");
                if(cells.length > 1) {
                    var data = {};
                    var xcol = parseInt($scope.xCol);
                    var ycol = parseInt($scope.yCol);

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

           $scope.csvPlots = [ /*trace0, trace3,trace4 ,trace5,*/ trace2,];


        });
    };
 
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
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
                scope.$apply(function () {
                    deferred.resolve(reader.result);
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
                $log.log("progress: " + event.loaded + ":" + event.total);
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
)
;;
