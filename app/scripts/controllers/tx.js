'use strict';

/**
 * @ngdoc function
 * @name infernoApp.controller:TxCtrl
 * @description
 * # TxCtrl
 * Controller of the infernoApp
 */
angular.module('infernoApp')
  .controller('TxCtrl', function ($http, $scope, fileReader) {
     
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
 
   var url = '/notes.txt';
   var url2 = 'https://dsmarkchen.github.io/inferno/notes.txt';
   $http.get(url2).then(function (rsp) {
        var usingBreaker = true; 
        $scope.rawnotes = rsp.data.split(/\r?\n/) ;
        for(var i = 0; i < $scope.rawnotes.length; i++) {
           $scope.buildone($scope.rawnotes[i], i, usingBreaker);
        } 

        localStorage.setItem("myComments", JSON.stringify($scope.notes));

        $scope.comments = JSON.parse(localStorage.getItem("myComments")) || []; 
    });



   $scope.comments = null; //JSON.parse(localStorage.getItem("myComments")) || [];
   if($scope.isNullOrEmpty($scope.comments)) {
        $scope.comments = [

        {  conto:5, line: 1, name: "1-3", comment: "1-3 descent to the second Circle: the lustful" },
        {  conto:5, line: 4, name: "4-15", comment: "4-15 proem: Minos judge of the damned" },
        {  conto:5, line: 16, name: "16-20", comment: "16-20 Minos attempts to discourage Dante" },
        {  conto:5, line: 21, name: "21-24", comment: "21-24 Virgil repeats his magical phrase (III.95-96)"},
        {  conto:5, line: 25, name: "25-30", comment: "25-30 again, impressions of sound are the first Dante has"},
        {  conto:5, line: 31, name: "31-39", comment: "31-39 the 'hellscape': weeping, darkness, storm"},
        {  conto:5, line: 40, name: "40-49", comment: "40-49 two similes: starlings and cranes"},
        {  conto:5, line: 50, name: "50-51", comment: "50-51 Dante wants to know who are punished here; Virgil:"},
        {  conto:5, line: 52, name: "52-63", comment: "52-63 Semiramis, Dido, Cleopatra"},
        {  conto:5, line: 64, name: "64-69", comment: "64-69 Helen, Achilles, Paris, Tristan, and many others"},
        {  conto:5, line: 70, name: "70-78", comment: "70-78 Dante's piteous reaction and desire to speak"},
        {  conto:5, line: 79, name: "79-81", comment: "79-81 he calls out to the pair of lovers"},
        {  conto:5, line: 82, name: "82-87", comment: "82-87 simile: doves returning to nest"},
        {  conto:5, line: 88, name: "88-108", comment: "88-108 Francesca's first speech:"},
        {  conto:5, line: 88, name: "88-96", comment: " 88-96 her kind words for Dante's kindness"},
        {  conto:5, line: 97, name: "97-99", comment: " 97-99 she is from Ravenna"},
        {  conto:5, line: 100, name: "100-108", comment: " 100-108 Love... Love... Love... : her litany of joy, woe"},
        {  conto:5, line: 109, name: "109-111", comment: " 109-111 Dante's reaction and Virgil's laconic question"},
        {  conto:5, line: 112, name: "112-120", comment: " 112-120 Dante's rumination and question to Francesca"},
        {  conto:5, line: 121, name: "121-138", comment: "121-138 Francesca's second response:"},
        {  conto:5, line: 121, name: "121-126", comment: "121-126 despite the pain it will cause, she will speak"},
        {  conto:5, line: 127, name: "127-129", comment: "127-129 she and Paolo were reading of Lancelot in love"},
        {  conto:5, line: 130, name: "130-138", comment: "130-138 enflamed by the reading, they embraced"},
        {  conto:5, line: 139, name: "139-142", comment: "139-142 coda: Francesca concludes, Paolo weeps, Dante faints"},


        {  conto:6, line: 1, name: "1-6", comment: " 1-6 Dante recovers from his syncope to find a new place"},
        {  conto:6, line: 7, name: "7-12", comment: " 7-12 the third Circle: cold downpour on stinking ground"},
        {  conto:6, line: 13, name: "13-21", comment: " 13-21 Cerberus presides, barking; he flays the sinners"},
        {  conto:6, line: 22, name: "22-27", comment: " 22-27 Cerberus's opposition and Virgil's 'sop' for him"},
        {  conto:6, line: 28, name: "28-33", comment: " 28-33 simile: dog ravenously gulping food"},
        {  conto:6, line: 34, name: "34-37", comment: " 34-37 Dante and Virgil pass over the prone shades"},
        {  conto:6, line: 38, name: "38-42", comment: " 38-42 Florence: Ciacco recognizes Dante and presents self"},
        {  conto:6, line: 43, name: "43-48", comment: " 43-48 Dante does not recognize him, transfigured by pain"},
        {  conto:6, line: 49, name: "49-57", comment: " 49-57 Ciacco identifies himself and his sin: gluttony"},
        {  conto:6, line: 58, name: "58-63", comment: " 58-63 Dante asks his views on the likely future of the city"},
        {  conto:6, line: 64, name: "64-72", comment: " 64-72 Ciacco: first the Whites, then the Blacks, will win"},
        {  conto:6, line: 73, name: "73-76", comment: " 73-76 the just are few, the sinners many"},
        {  conto:6, line: 77, name: "77-84", comment: " 77-84 Dante wants to know the afterlife of five townsmen"},
        {  conto:6, line: 85, name: "85-87", comment: " 85-87 Ciacco: all are in hell, as Dante will perhaps see"},
        {  conto:6, line: 88, name: "88-90", comment: " 88-90 Ciacco would like to be remembered to those above"},
        {  conto:6, line: 91, name: "91-93", comment: " 91-93 he returns to his hebetude"},
        {  conto:6, line: 94, name: "94-99", comment: " 94-99 Virgil: he will wake no more until the last trumpet"},
        {  conto:6, line: 100, name: "100-111", comment: " 100-111 Virgil on the increase of eternal pain for the damned"},
        {  conto:6, line: 112, name: "112-115", comment: " 112-115 they talk until they are ready to descend: Plutus"},


        {  conto:1, line: 1, name: "stray", comment: "deviate" },
        {  conto:1, line: 4, name: "savage", comment: "wild" },
        {  conto:1, line: 16, name: "ray", comment: "a narrow beam of light" },

        { name: "fugitive", conto:1,line: 25, comment: "straying" },
        { name: "lithe", conto:1,line: 31, comment: "flexible" },
        { name: "hide", conto:1,line: 31, comment: "n. skin" },
        { conto:1,line: 34, name: "impede", comment: "prevent" },
        { conto:1,line: 34, name: "ascent",comment: "upward movement" },

        { conto:1,line: 88, name: "shudder",comment: "tremble" },


        { name: "cowardice",conto:9, line: 1, comment: "lack of courage to face difficulty" },
        { name: "pallor", conto:9,line: 1, comment: "pale" },

        ];

        localStorage.setItem("myComments", JSON.stringify($scope.notes));
    }
   $scope.comments = JSON.parse(localStorage.getItem("myComments")) || [];



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
