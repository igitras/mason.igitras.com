'use strict';

/**
 * Created by mason on 7/1/14.
 */

// ~---- Public ++++++++++++++++++++++++++++++++++++++++++++
iGitrasMason.factory('MenuService', ['$http', function ($http) {
    var MenuService = {};

    MenuService.loadMenu = function () {
        return $http.get('contents/catelog.content');
    };

    return MenuService;
}
]);

iGitrasMason.factory('Session', ['$rootScope', '$cookieStore', 'ArticleService', function ($rootScope, $cookieStore, ArticleService) {
    var Session = {
        menuContent: {}
    };
    Session.create = function (data) {
        Session.menuContent = data;
        Session.init();
        $cookieStore.put('MenuContent', data);
    };

    Session.init = function () {
        ArticleService.loadInfo().success(function (data, status, headers, config) {
            Session.info = data;
            Session.maxArticleId = data.max_art_id;
            Session.minArticleId = 1;
            Session.maxCategoryId = data.max_cat_id;
            Session.minCategoryId = 1;
        });
    };

    Session.invalidate = function () {
        Session.menuContent = {};
        $cookieStore.remove('MenuContent');
    };

    Session.findMenuWithId = function(id){
        var findMenuWithin = Session.findMenuWithin(Session.menuContent.items, id);
//        alert(JSON.stringify(findMenuWithin));
        return  findMenuWithin;
    };

    Session.findMenuWithin = function(data, id){
        for(var i = 0; i < data.length; i++){
            if(data[i].id == id){
                return data[i];
            } else {
                var result = Session.findMenuWithin(data[i].children, id);
                if(result == null){
                    continue;
                } else {
                    return result;
                }
            }
        }
        return null;
    };

    Session.restoreSession = function () {
        var data = $cookieStore.get('MenuContent');
        if (!!data) {
            $rootScope.$broadcast('event:menu-contentRequired');
//            Session.init();
//            Session.menuContent = data;
        } else {
            $rootScope.$broadcast('event:menu-contentRequired');
        }
    };

    return Session;
}]);

iGitrasMason.factory('ArticleService', ['$http',  function ($http) {
    var ArticleService = {};

    ArticleService.loadArticle = function (id) {
        return  $http.get('contents/article/art-' + id + '.content');
    };

    ArticleService.loadArticles = function () {
        return  $http.get('contents/art-basic.content');
    };

    ArticleService.loadInfo = function () {
        return  $http.get('contents/info.content');
    };

    return ArticleService;
}
]);