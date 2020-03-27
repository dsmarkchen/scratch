'use strict';

/**
 * @ngdoc function
 * @name infernoApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the infernoApp
 */
angular.module('infernoApp')
  .controller('TxCtrl', function ($http, $scope, $sce, fileReader) {
     
    $scope.opt = localStorage.getItem("myOpt");
    if($scope.opt == null){
         $scope.opt = "pinsky";
         localStorage.setItem("myOpt", $scope.opt);
   }


   $scope.change = function() {
      localStorage.setItem("myOpt", $scope.opt);
   }

   $scope.isNullOrEmpty = function (value) {
        return value == null || value === "";
   }
   var conto;
   $scope.notes = [];
   $scope.buildone = function(item, index, useBreaker) {
      var withBreaker = ' ';
      if(useBreaker) {
            withBreaker='<br>';
      }
      var name ;
      var line;
      var text;
      var counter;
      if(item.trim().length > 0) {
            var exp = /^##/;
            item = item.replace(/‘/g, '&apos;');
            if (exp.test(item)) {
                conto = item.replace(/^## /, "");
            }
            var exp2 = /\d+-\d+/;
            if(exp2.test(item)) {
                var key = item.match(exp2);
                var line = item.match(/^\d+/);
                var res = item.replace(exp2, "");
                
                $scope.notes.push( {
                    conto: conto,
                    line: parseInt(line[0].trim(), 10),
                    name: key[0],
                    comment: item 
                })
            }
            
     }     

    };
var url = "http://public-api.wordpress.com/rest/v1/sites/wtmpeachtest.wordpress.com/posts"
var trustedUrl = $sce.trustAsResourceUrl(url);
$http.defaults.useXDomain =true;

$http({
        method: 'JSONP',
        url:        trustedUrl,
        jsonpCallbackParam: 'callback',
        isArray: false
  })
    .then(function(rsp){
        console.log("#### wordpress:    " + rsp.data.found);
    }, function (error) {
        console.log("#### wordpress error:" + error);
    });

   var stock_url =  //"https://query1.finance.yahoo.com/v8/finance/chart?symbol=AAPL&format=json&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkey";
                     "https://query1.finance.yahoo.com/v8/finance/chart/SU.TO";
   var trusted_stock_url = $sce.trustAsResourceUrl(stock_url);
$http({
    url: stock_url, 
    method: 'GET',
    params: { 'format': 'jsonp', 'symbol': 'SU.TO', 'range':'30d', 'interval': '1d', 'indicators': 'quote'},
    timeout: 300000,
    isArray: false
  })
    .then(function(rsp){
        
        var results = JSON.stringify(rsp.data.chart.result);
        $scope.results = JSON.parse(results);
        $scope.quote= $scope.results[0].indicators.quote[0];
        $scope.timestamp = $scope.results[0].timestamp;
        console.log($scope.results);
    }, function (error) {
        console.log("####  finance.yahoo error: " + error);
    });


    function tada (data) {
      // returning from async callbacks is (generally) meaningless
      console.log("tada: " + data.found);
    }






    $scope.visible = false;

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

  $scope.addComment = function() {
    var data = { 
        conto: $scope.addConto, 
        line:$scope.addLine,
        name: $scope.addName,
        comment: $scope.addNote
    };
    $scope.comments.push(data);  
  }   

  $scope.getFile = function () {
        $scope.progress = 0;
        $scope.textSrc = '';
        $scope.totalSymbols = 0;    
        $scope.totalLHs = 0;

        localStorage.setItem("totalSymbols", $scope.totalSymbols);
        localStorage.setItem("totalLHs", $scope.totalLHs);

        fileReader.readAsText($scope.file, $scope)
                      .then(function(result) {
                          $scope.textSrc = result;
                          $scope.lines= $scope.parseCSV(result, ",");
                          
                          $scope.lines.forEach(function (line) { 
                             var regex = /LH/;
                             if(regex.test(line)) {
                                $scope.totalSymbols += line.length - 4;
                                $scope.totalLHs ++;
                             }
                           });
                          localStorage.setItem("totalSymbols", $scope.totalSymbols);
                          localStorage.setItem("totalLHs", $scope.totalLHs);

                          //$scope.textSrc =angular.fromJson(result);
                          console.log(typeof(result));
                          console.log(typeof($scope.textSrc));
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
;
