'use strict';

angular
  .module('scratchApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
.directive('linePlot', function () {

    // Create a link function
    function linkFunc(scope, element, attrs) {
        scope.$watch('graphPlots', function (plots) {
            var layout = {
                'width': attrs.width,
                'height': attrs.height,
                'pad':'0',
                'margin': { 't': 0, 'b':20, 'l':40, 'r':0 },
            };

            Plotly.newPlot(element[0], plots, layout);
        }, true);
    }

    // Return this function for linking ...
    return {
        link: linkFunc
    };
})
.directive('volumePlot', function () {

    // Create a link function
    function linkFunc(scope, element, attrs) {
        scope.$watch('volumePlots', function (plots) {
            var layout = {
                /*'title': 'volume', */
                /*'xaxis': { 'tickformat': '%d'}, */
                'width': attrs.width,
                'height': attrs.height,
                'pad':'0',
                'margin': { 't': 40, 'b':20, 'l':40, 'r':0 },
            };

            Plotly.newPlot(element[0], plots, layout);
        }, true);
    }

    // Return this function for linking ...
    return {
        link: linkFunc
    };
})
.directive('csvPlot', function () {

    // Create a link function
    function linkFunc(scope, element, attrs) {
        scope.$watch('csvPlots', function (plots) {
            var layout = {
                'width': attrs.width,
                'height': attrs.height,
                'pad':'0',
                'margin': { 't': 0, 'b':20, 'l':40, 'r':0 },
            };

            Plotly.newPlot(element[0], plots, layout);
        }, true);
    }

    // Return this function for linking ...
    return {
        link: linkFunc
    };
}).directive('xwindow', ['$window', function ($window) {
     return {
        link: link,
        restrict: 'A'           
     };
     function link(scope, element, attrs){
        scope.width = $window.innerWidth;
        scope.height = $window.innerHeight;

            function onResize(){
                console.log($window.innerWidth);
                // uncomment for only fire when $window.innerWidth change   
                if (scope.width !== $window.innerWidth)
                {
                    scope.width = $window.innerWidth;
                    scope.$digest();
                }
                if (scope.height!== $window.innerHeight)
                {
                    scope.height= $window.innerHeight;
                    scope.$digest();
                }
             };

            function cleanUp() {
                angular.element($window).off('resize', onResize);
            }

            angular.element($window).on('resize', onResize);
            scope.$on('$destroy', cleanUp);
     }    
 }])
.directive('tooltip', function($compile, $sce) {
  return {
    restrict: 'A',
    scope: {
      content: '=tooltipContent'
    },
    link: function(scope, element, attrs) {
	
  		/* Attributes */
    
      scope.displayTooltip = false;
      
      /* Methods */
      scope.updateTooltipOpacity = function(opacity) {
          tooltip.css({
            opacity: opacity,
            'max-width':340
          });
      };
      scope.updateTooltipPosition = function(top, left) {
         var target  = $( this );
/*         var pos_left = target.offset().left + (target.outerWidth()/2); */

/*         if( $( window ).width() < tooltip.outerWidth() * 1.5 )
                tooltip.css( 'max-width', $( window ).width() / 2 );
         else
                tooltip.css( 'max-width', 340 );
 
        var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;
 
            if( pos_left < 0 )
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass( 'left' );
            }
            else
                tooltip.removeClass( 'left' );
 
            if( pos_left + tooltip.outerWidth() > $( window ).width() )
            {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass( 'right' );
            }
            else
                tooltip.removeClass( 'right' );
 
            if( pos_top < 0 )
            {
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass( 'top' );
            }
            else
                tooltip.removeClass( 'top' );
 
            tooltip.css( { left: pos_left, top: pos_top } )
                   .animate( { top: '+=10', opacity: 1 }, 50 );
*/
        tooltip.css({
            top: top + 'px',
            left: left + 'px',
          });
      };
      
      scope.getSafeContent = function(content) {
      	return $sce.trustAsHtml(content);
      };
      
      /* Bootstrap */

      var tooltip = angular.element(
      	'<div ng-show="displayTooltip" id="tooltip">\
        	<span ng-bind-html="getSafeContent(content)"></span>\
        </div>'
      );
      var tooltipold = angular.element(
      	'<div ng-show="displayTooltip" class="tooltip">\
        	<span ng-bind-html="getSafeContent(content)"></span>\
        </div>'
      );


      angular.element(document.querySelector('body')).append(tooltip);
      
      /* Bindings */
      
      element.on('mouseenter', function(event) {
        scope.displayTooltip = true;
        scope.$digest();
      });
      
      element.on('mousemove', function(event) {
        scope.updateTooltipOpacity(.9);
        scope.updateTooltipPosition(event.clientY - 20, event.clientX + 5);
//        scope.updateTooltipPosition(event.clientY -5, event.clientX + 5);
      });
      
      element.on('mouseleave', function() {
        scope.displayTooltip = false;
        scope.$digest();
      });
      
      /* Compile */
      
      $compile(tooltip)(scope);
    }
  };
  })
 .directive('xtooltip', function(){
    return {
            restrict: 'A',
            link: function(scope, element, attrs){
                element.hover(function(){
                    // on mouseenter
                    
                    element.tooltip({html: 'true', container:'body'});
                    element.tooltip('show');
                }, function(){
                    // on mouseleave
                    element.tooltip('hide');
                });
            }
    };
 }) 
.directive('bs-tooltip', function() {
  return function(scope, element, attrs) {
    attrs.$observe('title',function(title){
      // Destroy any existing tooltips (otherwise new ones won't get initialized)
      element.tooltip('destroy');
      // Only initialize the tooltip if there's text (prevents empty tooltips)
      if (jQuery.trim(title)) {
        element.tooltip();
      }
    });
    element.on('$destroy', function() {
      element.tooltip('destroy');
      delete attrs.$$observers['title'];
    });
  };
})
 .config(['$routeProvider', function ($routeProvider, $routeParams) {
    $routeProvider
       .when('/', {
        templateUrl: 'views/scratch.html',
        controller: 'ScratchCtrl',
        controllerAs: 'main'
      })
      .when('/inferno/', {
        templateUrl: 'views/scratch.html',
        controller: 'ScratchCtrl',
        controllerAs: 'main'
      })
      .when('/main', {
        templateUrl: 'views/scratch.html',
        controller: 'ScratchCtrl',
        controllerAs: 'main'
      })
      .when('/inferno/scratch', {
        templateUrl: 'views/scratch.html',
        controller: 'ScratchCtrl',
        controllerAs: 'main'
      })
       .when('/inferno/quote', {
        templateUrl: 'views/quote.html',
        controller: 'QuoteCtrl',
        controllerAs: 'tx'
      })
      .when('/quote', {
        templateUrl: 'views/quote.html',
        controller: 'QuoteCtrl',
        controllerAs: 'tx'
      })

      .when('/inferno/inferno', {
        templateUrl: 'views/inferno.html',
        controller: 'InfernoCtrl',
        controllerAs: 'inferno'
      })
      .when('/inferno', {
        templateUrl: 'views/inferno.html',
        controller: 'InfernoCtrl',
        controllerAs: 'inferno'
      })
       .when('/csv', {
        templateUrl: 'views/csv.html',
        controller: 'CsvCtrl',
        controllerAs: 'csv'
      })
      .otherwise({
        redirectTo: '/'
      });
     // $locationProvider.html5Mode(true);

  }]);
