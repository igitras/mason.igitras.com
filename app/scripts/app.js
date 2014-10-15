'use strict';

// Declare app level module which depends on views, and components
var iGitrasMason = angular.module('iGitrasMason', [
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'iGitrasMason.version'
]);

iGitrasMason.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
//    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'html/home.html',
            controller: 'HomeController'
        })
        .when('/cat/:id/art', {
            templateUrl: 'html/home.html',
            controller: 'CatalogArticleController'
        })
        .when('/art/:id', {
            templateUrl: 'html/article/article.html',
            controller: 'ArticleController'
        })

        .otherwise({redirectTo: '/'});
}]);

//iGitrasMason.constant('appprefix', "app/");

iGitrasMason.run(['$rootScope', '$location', '$http', 'Session', 'MenuService',
    function ($rootScope, $location, $http, Session, MenuService) {

        $rootScope.$on('event:menu-contentRequired', function () {
            MenuService.loadMenu();
        });

        $rootScope.$on('event:title-Updated', function (event, data) {
            $rootScope.pageInfo = data;
        });

    }
]);
