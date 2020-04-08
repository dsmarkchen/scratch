'use strict';

/**
 * @ngdoc function
 * @name scratchApp.controller:QuoteCtrl
 * @description
 * # QuoteCtrl
 * Controller of the scratchApp
 */
angular.module('scratchApp')
    .controller('QuoteCtrl', function ($http, $scope, $sce) {

        $scope.symbol = localStorage.getItem("mySym");
        if ($scope.symbol == null) {
            $scope.symbol = "hod.to";
            localStorage.setItem("mySym", $scope.symbol);
        }



        $scope.opt = localStorage.getItem("myOpt");
        if ($scope.opt == null) {
            $scope.opt = "30";
            localStorage.setItem("myOpt", $scope.opt);
        }


        $scope.changeDays = function () {
            localStorage.setItem("myOpt", $scope.opt);
        };

        $scope.isNullOrEmpty = function (value) {
            return value == null || value === "";
        };

        $http.defaults.useXDomain = true;

        $scope.getSymbol = function () {
            if ($scope.symbol == null) {
                $scope.symbol = "hod.to";
                localStorage.setItem("mySym", $scope.symbol);
            }

            localStorage.setItem("mySym", $scope.symbol);
            console.log("#### getSymbol:    " + $scope.symbol);
            var stock_url = "https://query1.finance.yahoo.com/v8/finance/chart/" + $scope.symbol;
            var trusted_stock_url = $sce.trustAsResourceUrl(stock_url);

            $http({
                url: trusted_stock_url,
                method: 'GET',
                params: { 'format': 'jsonp', 'symbol': $scope.symbol, 'range': $scope.opt + 'd', 'interval': '1d', 'indicators': 'quote' },
                timeout: 300000,
                isArray: false
            })
                .then(function (rsp) {

                    var results = JSON.stringify(rsp.data.chart.result);
                    $scope.results = JSON.parse(results);
                    $scope.quote = $scope.results[0].indicators.quote[0];
                    $scope.timestamp = $scope.results[0].timestamp;

                    var i = 0;
                    var xx = [];
                    var v_close = [];
                    var v_open = [];
                    var v_high = [];
                    var v_low = [];

                    for (var item in $scope.quote.close) {
                        xx.push(i);
                        v_open.push($scope.quote.open[item]);
                        v_high.push($scope.quote.high[item]);
                        v_low.push($scope.quote.low[item]);
                        v_close.push($scope.quote.close[item]);
                        i++;
                    }

                    var trace2 = {
                        x: xx,
                        y: v_close,
                        type: 'scatter'
                    };

                    var trace3 = {
                        x: xx,
                        y: v_open,
                        type: 'scatter'
                    };

                    var trace4 = {
                        x: xx,
                        y: v_low,
                        type: 'scatter'
                    };

                    var trace5 = {
                        x: xx,
                        y: v_high,
                        type: 'scatter'
                    };


                    var trace0 = {
                        x: $scope.timestamp,
                        open: v_open,
                        close: v_close,
                        high: v_high,
                        low: v_low,
                        type: 'candlestick'
                    };


                    $scope.graphPlots = [ /*trace0, trace3,trace4 ,trace5,*/ trace2,];
                    console.log($scope.results);
                }, function (error) {
                    console.log("####  finance.yahoo error: " + error);
                });


        };







        $scope.visible = false;

    });

