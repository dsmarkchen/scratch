"use strict";angular.module("scratchApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).directive("linePlot",function(){return{link:function(t,n,r){t.$watch("graphPlots",function(t){var e={width:r.width,height:r.height,pad:"0",margin:{t:0,b:20,l:40,r:0}};Plotly.newPlot(n[0],t,e)},!0)}}}).directive("csvPlot",function(){return{link:function(t,n,r){t.$watch("csvPlots",function(t){var e={width:r.width,height:r.height,pad:"0",margin:{t:0,b:20,l:40,r:0}};Plotly.newPlot(n[0],t,e)},!0)}}}).directive("xwindow",["$window",function(o){return{link:function(t,e,n){function r(){console.log(o.innerWidth),t.width!==o.innerWidth&&(t.width=o.innerWidth,t.$digest()),t.height!==o.innerHeight&&(t.height=o.innerHeight,t.$digest())}t.width=o.innerWidth,t.height=o.innerHeight,angular.element(o).on("resize",r),t.$on("$destroy",function(){angular.element(o).off("resize",r)})},restrict:"A"}}]).directive("tooltip",["$compile","$sce",function(o,l){return{restrict:"A",scope:{content:"=tooltipContent"},link:function(e,t,n){e.displayTooltip=!1,e.updateTooltipOpacity=function(t){r.css({opacity:t,"max-width":340})},e.updateTooltipPosition=function(t,e){$(this);r.css({top:t+"px",left:e+"px"})},e.getSafeContent=function(t){return l.trustAsHtml(t)};var r=angular.element('<div ng-show="displayTooltip" id="tooltip">        \t<span ng-bind-html="getSafeContent(content)"></span>        </div>');angular.element('<div ng-show="displayTooltip" class="tooltip">        \t<span ng-bind-html="getSafeContent(content)"></span>        </div>');angular.element(document.querySelector("body")).append(r),t.on("mouseenter",function(t){e.displayTooltip=!0,e.$digest()}),t.on("mousemove",function(t){e.updateTooltipOpacity(.9),e.updateTooltipPosition(t.clientY-20,t.clientX+5)}),t.on("mouseleave",function(){e.displayTooltip=!1,e.$digest()}),o(r)(e)}}}]).directive("xtooltip",function(){return{restrict:"A",link:function(t,e,n){e.hover(function(){e.tooltip({html:"true",container:"body"}),e.tooltip("show")},function(){e.tooltip("hide")})}}}).directive("bs-tooltip",function(){return function(t,e,n){n.$observe("title",function(t){e.tooltip("destroy"),jQuery.trim(t)&&e.tooltip()}),e.on("$destroy",function(){e.tooltip("destroy"),delete n.$$observers.title})}}).config(["$routeProvider",function(t,e){t.when("/",{templateUrl:"views/scratch.html",controller:"ScratchCtrl",controllerAs:"main"}).when("/inferno/",{templateUrl:"views/scratch.html",controller:"ScratchCtrl",controllerAs:"main"}).when("/main",{templateUrl:"views/scratch.html",controller:"ScratchCtrl",controllerAs:"main"}).when("/inferno/scratch",{templateUrl:"views/scratch.html",controller:"ScratchCtrl",controllerAs:"main"}).when("/inferno/quote",{templateUrl:"views/quote.html",controller:"QuoteCtrl",controllerAs:"tx"}).when("/quote",{templateUrl:"views/quote.html",controller:"QuoteCtrl",controllerAs:"tx"}).when("/inferno/inferno",{templateUrl:"views/inferno.html",controller:"InfernoCtrl",controllerAs:"inferno"}).when("/inferno",{templateUrl:"views/inferno.html",controller:"InfernoCtrl",controllerAs:"inferno"}).when("/csv",{templateUrl:"views/csv.html",controller:"CsvCtrl",controllerAs:"csv"}).otherwise({redirectTo:"/"})}]),angular.module("scratchApp").controller("ScratchCtrl",["$window","$scope","$location","fileReader",function(t,l,e,n){this.test="testing mainController",l.selectedScratch=null;var r,o,i=window.localStorage.getItem("scratches");null==i&&(i=[{check:!1,name:"Quotes",title:"Quotes",scratches:[{check:!1,name:"plotly",title:"plotly"},{check:!1,name:"bollingerbands",title:"bollinger bands"}]},{check:!1,name:"Utility",title:"UTE Utility Development ",scratches:[]}],localStorage.setItem("scratches",JSON.stringify(i)),i=window.localStorage.getItem("scratches")),l.scratches=JSON.parse(i),l.scratchNames=[">> add new one "];for(var a=0;a<l.scratches.length;a++)l.scratchNames.push(l.scratches[a].name);l.selectedScratch=l.scratchNames[0],l.saveJSON=function(){var t=JSON.stringify(l.scratches),e=new Blob([t],{type:"application/json"});l.filename=l.filename||"my_json",saveAs(e,l.filename+".json")},l.deleteScratch=function(t,e){console.log("delete "+t+" "+e);for(var n=l.scratches.findIndex(function(t){return t.name==e}),r=l.scratches[n].scratches,o=0;o<r.length;o++)if(console.log(r[o].name),r[o].name==t){r.splice(o,1),localStorage.setItem("scratches",JSON.stringify(l.scratches));break}},l.select=function(t){l.name=t.name,l.title=t.title,console.log("select "+l.name)},l.delete=function(t){console.log("delete "+t),l.scratches.splice(t,1),localStorage.setItem("scratches",JSON.stringify(l.scratches))},l.update=function(e){var t=l.scratches.findIndex(function(t){return t.name==e.name});l.scratches[t].name=e.name,l.scratches[t].check=e.check,localStorage.setItem("scratches",JSON.stringify(l.scratches))},l.toggle=function(t){console.log("toggle: "+t.name+" check: "+t.check),t.check=!t.check,l.update(t)},l.add=function(){var e=l.selectedScratch;var t=l.addPageName.replace(/[\t ]/g,"_");if(null==e||e.includes(">> add")){var n={check:!1,name:t,title:l.addPageName,scratches:[]};l.scratches.push(n),localStorage.setItem("scratches",JSON.stringify(l.scratches))}else{var r=l.scratches.findIndex(function(t){return t.name==e}),o={name:t,title:l.addPageName,check:!1};l.scratches[r].scratches.push(o),localStorage.setItem("scratches",JSON.stringify(l.scratches))}},l.getFile=function(){n.readAsText(l.file,l).then(function(t){var e=JSON.parse(t);l.scratches=e})},l.$on("fileProgress",function(t,e){console.log("progress  "+e.loaded+"/"+e.total)}),l.isActive=function(t){return t===e.path()},l.ie=(r=window.navigator.userAgent,0<(o=r.indexOf("MSIE"))?parseInt(r.substring(o+5,r.indexOf(".",o))):navigator.userAgent.match(/Trident\/7\./)?11:0),l.$watch("scratchSelectionText",function(t){for(var e in l.scratches){var n=l.scratches[e];if(n.name===t){l.selectedScratch=n;break}}})}]),angular.module("scratchApp").controller("CsvCtrl",["$scope","fileReader",function(s,t){s.isNullOrEmpty=function(t){return null==t||""===t},s.refreshPlot=function(){s.plot()},s.processData=function(t){for(var e=t.split(/\r\n|\n/),n=e[0].split(","),r=[],o=0;o<e.length;o++){var l=e[o].split(",");if(l.length==n.length){for(var i=[],a=0;a<n.length;a++)i.push(l[a]);r.push(i)}}return r},s.parseCSV=function(t,e){var n=t.split(/\r\n|\r|\n/g);for(var r in n){for(var o,l=n[r].split(e=e||","),i=l.length-1;0<=i;i--)'"'==l[i].replace(/"\s+$/,'"').charAt(l[i].length-1)?1<(o=l[i].replace(/^\s+"/,'"')).length&&'"'==o.charAt(0)?l[i]=l[i].replace(/^\s*"|"\s*$/g,"").replace(/""/g,'"'):i?l.splice(i-1,2,[l[i-1],l[i]].join(e)):l=l.shift().split(e).concat(l):l[i].replace(/""/g,'"');n[r]=l}return n},s.plot=function(){var t=s.textSrc.split("\r\n");s.vX=[],s.vY=[];var e=parseInt(s.xCol),n=parseInt(s.yCol),r=e;r<n&&(r=n);for(var o=0;o<t.length;o++){o%10==0&&console.log("..readAsText.. "+o+" "+t.length);var l=t[o].split(",");if(l.length>r){var i={};0<l[e].length&&0<l[n].length&&(i.x=l[e],i.y=l[n],s.vX.push(i.x),s.vY.push(i.y))}}var a={x:s.vX,y:s.vY,type:"scatter"};s.csvPlots=[a]},s.getFile=function(){s.percent=0,s.textSrc="",t.readAsText(s.file,s).then(function(t){s.textSrc=t,s.lines=s.parseCSV(t,",")})},s.$on("fileProgress",function(t,e){s.percent=parseInt(100*e.loaded/e.total,10),console.log("progress  "+s.percent+"%")})}]).directive("ngFileSelect",function(){return{link:function(e,t){t.bind("change",function(t){e.file=(t.srcElement||t.target).files[0],e.getFile()})}}}).factory("fileReader",["$q","$log",function(r,o){o.log("fileReader");function l(t,e){var n=new FileReader;return n.onload=function(t,e,n){return function(){o.log("fileReader onload"),n.$apply(function(){e.resolve(t.result)})}}(n,t,e),n.onerror=function(t,e,n){return function(){n.$apply(function(){e.reject(t.result)})}}(n,t,e),n.onprogress=function(t,e){return function(t){e.$broadcast("fileProgress",{total:t.total,loaded:t.loaded})}}(0,e),n.onloadend=function(t,e){return function(t){o.log("fileReader loadend"),e.$broadcast("fileProgress",{total:t.total,loaded:t.loaded})}}(0,e),n}return{readAsText:function(t,e){var n=r.defer();return l(n,e).readAsText(t),n.promise}}}]),angular.module("scratchApp").directive("xelement",["$timeout",function(l){return{restrict:"A",link:function(n,r,o){r.ready(function(){var t,e;l(function(){t=r[0].offsetHeight,e=r[0].offsetWidth,o.key?n[o.key]={height:t,width:e}:n.elementSize={height:t,width:e}})})}}}]).filter("myCantoFilter",function(){return function(t,e){var n=[];if(""==e)return t;var r=e.split(/[,:]/),o=r[0],l=r[1],i=r[2];return angular.forEach(t,function(t){null!=t.name&&t.name.trim()==o.trim()&&t.line>=l&&t.line<i&&n.push(t)}),n}}).filter("conto",function(){return function(t,e){var n=[];if(""==e)return n;var r=e.split(/[,:]/),o=r[0],l=r[1],i=r[2];return angular.forEach(t,function(t){t.conto==o&&t.line>=l&&t.line<=i&&n.push(t)}),n}}).controller("InfernoCtrl",["$scope","$http","$filter",function(a,t,e){a.opt=localStorage.getItem("myOpt"),null==a.opt&&(a.opt="pinsky",localStorage.setItem("myOpt",a.opt)),a.isNullOrEmpty=function(t){return null==t||""===t},a.comments=JSON.parse(localStorage.getItem("myComments"))||[],a.getFilteredComments=function(){return e("conto")(a.comments,1,1,9)},a.rxTotalSymbols=60,a.rxTotalLHs=1,a.myQuery=localStorage.getItem("myQuery"),a.isNullOrEmpty(a.myQuery)&&(a.myQuery="1:1,25",localStorage.setItem("myQuery",a.myQuery)),localStorage.setItem("rxTotalSymbols",a.rxTotalSymbols),localStorage.setItem("rxTotalLHs",a.rxTotalLHs);var l=0,i=[];a.cantoes=[];var s="",n="https://dsmarkchen.github.io/inferno/inferno.txt";"bang"==a.opt&&(n="https://dsmarkchen.github.io/inferno/infernobang.txt"),"pinsky"==a.opt&&(n="https://dsmarkchen.github.io/inferno/infernopinsky.txt"),t.get(n).then(function(t){a.inferno=t.data.split(/\r?\n/);for(var e=0;e<a.inferno.length;e++)a.buildone(a.inferno[e],e,!0);0<i.length&&a.cantoes.push({line:l-1,text:i.join("<br>")})});var c=3;a.move=function(){var t=a.myQuery;if(""!=t){var e=t.split(/[,:]/),n=e[0].trim(),r=parseInt(e[1].trim(),10),o=parseInt(e[2].trim(),10),l=o-r;if(0<c){o=o+l+1;var i=(r=r+l+1)%3;0==i&&(r+=1,o+=1),2==i&&(r-=1,o-=1)}c<0&&(r=r-l-1,o=o-l-1,0==i&&(r+=1,o+=1),2==i&&(r-=1,o-=1)),r<0&&(r=1),a.myQuery=n+":"+r.toString()+","+o.toString(),localStorage.setItem("myQuery",a.myQuery)}},a.prev=function(){c=-3,a.move()},a.next=function(){c=3,a.move()},a.buildone=function(t,e,n){var r=" ";if(n&&(r="<br>"),0<t.trim().length){if(/^##/.test(t))return 0<i.length&&(a.cantoes.push({name:s,line:l,text:i.join(r),visible:!0}),i=[]),s=t.replace(/^## /,""),void(l=0);var o=t.replace(/--/g,"&#x2012;");i.push(o.trim()),l++,3==i.length&&(a.cantoes.push({name:s,line:l-2,text:i.join(r),visible:!0}),i=[])}}}]),angular.module("scratchApp").controller("QuoteCtrl",["$http","$scope","$sce",function(n,d,r){d.symbol=localStorage.getItem("mySym"),null==d.symbol&&(d.symbol="hod.to",localStorage.setItem("mySym",d.symbol)),d.opt=localStorage.getItem("myOpt"),null==d.opt&&(d.opt="30",localStorage.setItem("myOpt",d.opt)),d.changeDays=function(){localStorage.setItem("myOpt",d.opt)},d.isNullOrEmpty=function(t){return null==t||""===t},n.defaults.useXDomain=!0,d.getSymbol=function(){null==d.symbol&&(d.symbol="hod.to",localStorage.setItem("mySym",d.symbol)),localStorage.setItem("mySym",d.symbol),console.log("#### getSymbol:    "+d.symbol);var t="https://query1.finance.yahoo.com/v8/finance/chart/"+d.symbol,e=r.trustAsResourceUrl(t);n({url:e,method:"GET",params:{format:"jsonp",symbol:d.symbol,range:d.opt+"d",interval:"1d",indicators:"quote"},timeout:3e5,isArray:!1}).then(function(t){var e=JSON.stringify(t.data.chart.result);d.results=JSON.parse(e),d.quote=d.results[0].indicators.quote[0],d.timestamp=d.results[0].timestamp;var n=0,r=[],o=[],l=[],i=[],a=[];for(var s in d.quote.close)r.push(n),l.push(d.quote.open[s]),i.push(d.quote.high[s]),a.push(d.quote.low[s]),o.push(d.quote.close[s]),n++;var c={x:r,y:o,type:"scatter"};d.timestamp;d.graphPlots=[c],console.log(d.results)},function(t){console.log("####  finance.yahoo error: "+t)})},d.visible=!1}]),angular.module("scratchApp").run(["$templateCache",function(t){t.put("views/csv.html",' <div class="container"> <div xwindow> <div class="row"> <div class="col"> <form> <input type="file" ng-file-select="onFileSelect($files)" class="form-control-file border"> </form> </div> <div class="col"> <div class="progress"> <div class="progress-bar" role="progressbar" ng-style="{\'width\': percent + \'%;\'}" aria-valuenow="{{percent}}" aria-valuemin="0" aria-valuemax="100">{{progress}}%</div> </div> <span>{{ percent}}</span> </div> </div> <div class="row"> <input ng-model="visible" type="checkbox"> <label>view data </label> <i ng-hide="lines">No csv file choosed</i> <table class="table table-striped" ng-show="visible"> <tr> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th> <th>6</th> </tr> <tr ng-repeat="line in  lines track by $index"> <td> {{line[0]}} </td> <td> {{line[1]}} </td> <td> {{line[2]}} </td> <td> {{line[3]}} </td> <td> {{line[4]}} </td> <td> {{line[5]}} </td> </tr> </table> </div> \x3c!-- row--\x3e <div class="row"> <label>x: </label> <input type="text" ng-model="xCol" ng-init="xCol = \'0\'"> <label>y: </label> <input type="text" ng-model="yCol" ng-init="yCol = \'3\'"> <button ng-click="refreshPlot()" ng-if="lines.length > 0 "> Refresh</button> </div> <div class="col"> <csv-plot csv-plots="csvPlots" width="600" height="400"></csv-plot> </div> </div> <p ng-if="width > 320">The device window is: [{{width}}, {{height}}].</p> <p> This is about view. </p> </div> '),t.put("views/inferno.html",'<div class="container"> <div class="row"> <div class="col-md-2 col-sm-12"> <div class="row"> <div class="col"> <form> <div class="form-group"> <div class="input-group"> <div class="input-group-addon"><i class="fa fa-search"></i></div> <input type="text" class="form-control" placeholder="query: start, end" ng-model="myQuery"> </div> </div> </form> </div> </div> <div class="row"> <div class="col"> <form> <button class="btn btn-secondary" ng-click="prev()"> prev</button> <button class="btn btn-secondary" ng-click="next()"> next</button> </form> </div> </div> </div> <div class="col-md-10 col-sm-12"> <div ng-repeat="canto in cantoes | myCantoFilter: myQuery  track by $index "> <div class="row" ng-if="canto.visible"> <div class="col-1" style="margin:0px 0px 0px 0px;padding:0px 0px; border: 1px solid #f8f9fa"> <p class="line" style="margin:0px 0px 0px 0px;padding:0px 0px;background-color:#f8f9fa">{{canto.name}}:{{canto.line}} </p> </div> <div class="col-11" style="padding-left:1px;padding-right:1px"> \x3c!--\r\n                  <div xelement>\r\n                    <p ng-if="elementSize.width > 100 && $index == 0" >The element width: {{elementSize.width}}.</p>\r\n                  </div>\r\n              --\x3e <p class="canto" style="background-color:lavender;margin-left:0;width:100%" ng-bind-html="canto.text"></p> </div> </div> </div> </div> </div> <div class="row"> <div class="col"> <br><br> <ul class="list-group list-group-flush"> <li class="list-group-item" ng-repeat="comment in comments  | conto: myQuery track by $index"> <i class="fa fa-caret-right" sytle="height:80px" tooltip tooltip-content="comment.comment"> {{comment.name}} </i> </li> </ul> </div> </div> </div> '),t.put("views/quote.html",'<div class="container"> \x3c!-- <div class="row">\r\n   <table>\r\n   <tr ng-repeat="result in results track by $index">\r\n        <td> currency: {{result.meta.currency}} </td> \r\n        <td> symbol: {{result.meta.symbol}} </td> \r\n   </tr>\r\n   </table>\r\n</div>\r\n--\x3e <div class="row"> <div class="col"> <input type="text" name="symbol" ng-model="symbol"> <button class="btn btn-primary" ng-click="getSymbol()">Get</button>  <code>text = {{symbol}}</code> </div> <div class="col"> <form> <label class="radio-inline"> <input type="radio" ng-model="opt" value="30" ng-change="changeDays()">Default (30) </label> <label class="radio-inline"> <input type="radio" ng-model="opt" value="556" ng-change="changeDays()">556 </label> <label class="radio-inline"> <input type="radio" ng-model="opt" value="1132" ng-change="changeDays()">1132 </label> <tt>opt = {{opt}}</tt><br> </form> </div> </div> <div class="row"> <div class="col"> <table class="table table-striped"> <tr> <th>Date</th> <th>Open</th> <th>High</th> <th>Low</th> <th>Close</th> </tr> <tr ng-repeat="close in quote.close track by $index"> <td> {{timestamp[$index] * 1000 | date: \'yy-MM-dd\'}} </td> <td> {{quote.open[$index] | number:1}} </td> <td> {{quote.high[$index] | number:1}} </td> <td> {{quote.low[$index] | number:1}} </td> <td> {{quote.close[$index] | number:1}} </td> </tr> </table> </div> <div class="col"> <line-plot graph-plots="graphPlots" width="600" height="400"></line-plot> \x3c!-- <line-plot width=600, height=400>  --\x3e </div> </div> \x3c!--\r\n   <b>Statistics:</b><br />\r\n\r\n    <table class="table table-striped">\r\n     <tr>\r\n        <th>Name</th>\r\n        <th>Counts </th>\r\n     </tr>\r\n     <tr> \r\n        <td>Total Symbols </td>\r\n        <td>{{totalSymbols}}</td>\r\n     </tr>\r\n     <tr> \r\n        <td>Total Sequences </td>\r\n        <td>{{totalLHs}}</td>\r\n     </tr>\r\n    </table>\r\n   \r\n   <b>Preview:</b> \r\n   <input ng-model="visible" type="checkbox"/>\r\n   <br />\r\n   <i ng-hide="textSrc">No text file choosed</i>\r\n   <pre ng-show="visible">{{textSrc}}</pre>\r\n   \r\n   <br/> \r\n   <b>Progress:</b>\r\n  <progress value="{{progress}}"></progress>\r\n</div>\r\n--\x3e </div>'),t.put("views/scratch.html",'<div class="jumbotron jumbotron-fluid"> <div class="container"> <div class="block"> <h1 class="animated fadeInUp">Scratch</h1> <p class="animated fadeInUp">Your Notes</p> <div ng-hide="ie == 0"> <p class="animated fadeInUp">IE {{ie}}</p> </div> </div> </div> </div> <div class="container"> <div class="row"> <h3>Scratches</h3> </div> <div class="row"> <table class="table table-striped"> <tr> <th width="10%"> Status</th> <th width="40%"> Name</th> <th width="40%"> Scratch</th> <th width="10%"> Delete</th> </tr> <tr ng-repeat="ppp in scratches track by $index" tabindex="1" ng-click="select(ppp)"> <td><div class="checkbox"> <input type="checkbox" value="{{ppp.check}}" ng-model="ppp.check" ng-change="update(ppp)" ng-true-value="\'YES\'" ng-false-value="\'NO\'"> {{ppp.check}}</div> </td> <td> {{ppp.title}} </td> <td> <table> <tr ng-if="0 == 1"> <th width="10%"> Check</th> <th width="40%"> Name</th> <th width="10%"> Delete</th> </tr> <tr ng-repeat="scratch in ppp.scratches track by $index"> <td width="20%"> <input type="checkbox" value="{{scratch.check}}" ng-model="scratch.check" ng-change="update(ppp)" ng-true-value="\'YES\'" ng-false-value="\'NO\'"> {{scratch.check}} </td> <td width="70%"> <input value="{{scratch.title}}">  </td> <td width="10%"> <span ng-click="deleteScratch(scratch.name, ppp.name)"> x</span> </td> </tr> </table> </td> <td> <span ng-click="delete($index)"> x</span> </td> </tr> </table> </div> <div class="row"> <select ng-model="selectedScratch" ng-options="name for name in scratchNames"> </select> <label for="addScratch">Name:</label> <input ng-model="addPageName"> <button class="btn btn-primary" ng-click="add()">Add</button>  </div> <div class="row"> File Name: <input type="text" ng-model="filename"><br> <button ng-click="saveJSON()">Save</button> <form> <input type="file" ng-file-select="onFileSelect($files)" class="form-control-file border"> <progress value="{{progress}}"></progress> </form> </div> <div class="row"> <div class="form-group"> <label for="updateTitle">Name:</label> <input ng-model="name"> <button ng-click="update()" class="button button-primary">Update</button> </div> </div> <div class="row"> <div xwindow> <p ng-if="width > 320">The device window is: [{{width}}, {{height}}].</p> </div> </div> </div> ')}]);