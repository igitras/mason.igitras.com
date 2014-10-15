'use strict';

/**
 * Created by mason on 7/1/14.
 */

// ~---- Public ++++++++++++++++++++++++++++++++++++++++++++
iGitrasMason.controller('HeaderController', ['$scope', 'Session', 'MenuService',
    function ($scope, Session, MenuService) {
        $scope.init = function () {
            if (!Session.menuContent.items) {
                Session.restoreSession();
            }

            MenuService.loadMenu().success(
                function (data, status, headers, config) {
                    Session.create(data);
                    $scope.$broadcast('event:menu-contentLoaded', data);
                    $scope.initMenu(Session.menuContent);
                }
            );
        };

        $scope.$on('event:menu-contentLoaded', function(data) {
            $scope.initMenu(data);
        });

        $scope.initMenu = function (data) {
            $scope.menus = data.items;
        };
    }
]);

iGitrasMason.controller('HomeController', ['$scope', 'ArticleService', function ($scope, ArticleService) {
    $scope.pageInfo = {
        title: "Home Page, Masons Blog",
        keywords: "Mason's Blog, Technology, Docker",
        desc: ""
    };

    $scope.pagination = {
        size: 3,
        last: true,
        first: true,
        number: 0,
        totalElements: 0,
        totalPages: 0,
        sort: null
    };

    $scope.readPageInfo = function (data) {
        var pageable = {};
        pageable.size = data.size;
        pageable.number = data.number;
        pageable.first = data.first;
        pageable.last = data.last;
        pageable.totalElements = data.totalElements;
        pageable.totalPages = data.totalPages;
        pageable.sort = data.sort;
        $scope.pagination = pageable;
    };

    $scope.makeRange = function (totalPage, current) {
        var arr = [];
        if (totalPage <= 10) {
            for (var i = 0; i < totalPage; i++) {
                arr.push(i);
            }
        } else {
            arr.push(current);
            var count = 1;
            for (var i = 0; i < 10; i++) {
                if (count == 10) {
                    break;
                }
                if (current + i < totalPage) {
                    arr.push(current + i);
                    count++;
                }
                if (count == 10) {
                    break;
                }
                if (current - i >= 0) {
                    arr.push(current - i);
                    count++;
                }
            }
            arr = arr.sort();
        }
        return arr;
    };

    $scope.goPage = function (page) {
        $scope.pagination.number = page;
        $scope.findAll();
    };

    $scope.buildPageableInfo = function () {
        var info = '';
        info += 'page=' + $scope.pagination.number;
        info += '&size=' + $scope.pagination.size;
        return info;
    };

    $scope.findAll = function () {
        $scope.loadArticles();
    };

    $scope.loadArticles = function () {
        ArticleService.loadArticles().success(
            function (data, status, headers, config) {
                $scope.articles = data;

                //filter with the pagination
                $scope.filterArticles($scope.articles);
            }
        );
        $scope.$emit('event:title-Updated', $scope.pageInfo);
    };

    $scope.filterArticles = function (data) {
        var arts = [];

        $scope.pagination.totalElements = data.length;
        $scope.pagination.totalPages = Math.ceil($scope.pagination.totalElements / $scope.pagination.size);
        $scope.pagination.first = ($scope.pagination.number === 1);
        $scope.pagination.last = ($scope.pagination.number === $scope.pagination.totalPages);

        var counter = 1;
        for (var c = 0; c < data.length; c++) {
            if (data[c].id >= $scope.pagination.number * $scope.pagination.size + 1 && counter <= $scope.pagination.size) {
                counter++;
                arts.push(data[c]);
            }
        }

        $scope.articles = arts;
    };

    $scope.loadArticles();
}]);

iGitrasMason.controller('CatalogArticleController', ['$scope', '$routeParams', 'ArticleService', 'Session', function ($scope, $routeParams, ArticleService, Session) {
    $scope.pageInfo = {
        title: "",
        keywords: "",
        desc: ""
    };

    $scope.pagination = {
        size: 3,
        last: true,
        first: true,
        number: 0,
        totalElements: 0,
        totalPages: 0,
        sort: null
    };

    $scope.readPageInfo = function (data) {
        var pageable = {};
        pageable.size = data.size;
        pageable.number = data.number;
        pageable.first = data.first;
        pageable.last = data.last;
        pageable.totalElements = data.totalElements;
        pageable.totalPages = data.totalPages;
        pageable.sort = data.sort;
        $scope.pagination = pageable;
    };

    $scope.makeRange = function (totalPage, current) {
        var arr = [];
        if (totalPage <= 10) {
            for (var i = 0; i < totalPage; i++) {
                arr.push(i);
            }
        } else {
            arr.push(current);
            var count = 1;
            for (var i = 0; i < 10; i++) {
                if (count == 10) {
                    break;
                }
                if (current + i < totalPage) {
                    arr.push(current + i);
                    count++;
                }
                if (count == 10) {
                    break;
                }
                if (current - i >= 0) {
                    arr.push(current - i);
                    count++;
                }
            }
            arr = arr.sort();
        }
        return arr;
    };

    $scope.goPage = function (page) {
        $scope.pagination.number = page;
        $scope.findAll();
    };

    $scope.buildPageableInfo = function () {
        var info = '';
        info += 'page=' + $scope.pagination.number;
        info += '&size=' + $scope.pagination.size;
        return info;
    };

    $scope.findAll = function () {
        ArticleService.loadArticles().success(
            function (data, status, headers, config) {
                $scope.articles = data;
                //filter with the pagination
                $scope.filterArticles($scope.articles);
            }
        );
        $scope.$emit('event:title-Updated', $scope.pageInfo);

    };

    $scope.filterArticles = function (data) {
        $scope.getCatalogArtIds();
        $scope.processPagination();

        var arts = [];

        // current page ids
        var ids = [];
        var startIndex = $scope.pagination.number * $scope.pagination.size;
        var counter = 0;
        for (var i = startIndex; i < $scope.artIdInCatalog.length; i++) {
            if (counter < $scope.pagination.size) {
                counter++;
                ids.push($scope.artIdInCatalog[i]);
            }
        }
        for (var c = 0; c < data.length; c++) {
            if ($scope.checkIdContained(data[c].id, ids)) {
                arts.push(data[c]);
            }
        }

        $scope.articles = arts;

    };

    $scope.getCatalogArtIds = function () {
        if ($scope.artIdInCatalog === undefined) {
            var menu = Session.findMenuWithId($routeParams.id);

            if (menu !== null && menu !== undefined) {
                var ids = [];
                $scope.addArticleIds(ids, menu);
                $scope.artIdInCatalog = ids.sort();
            }
        }
    };
    $scope.processPagination = function () {
        $scope.pagination.totalElements = $scope.artIdInCatalog.length;
        $scope.pagination.totalPages = Math.ceil($scope.pagination.totalElements / $scope.pagination.size);
        $scope.pagination.first = ($scope.pagination.number === 1);
        $scope.pagination.last = ($scope.pagination.number === $scope.pagination.totalPages);
    };

    $scope.checkIdContained = function (id, ids) {
        for (var i = 0; i < ids.length; i++) {
            if (ids[i] === id) {
                return true;
            }
        }
        return false;
    };

    $scope.addArticleIds = function (ids, menu) {
        if (menu.articles.length > 0) {
            for (var i = 0; i < menu.articles.length; i++) {
                ids.push(menu.articles[i]);
            }
        }
        if (menu.children.length > 0) {
            for (var i = 0; i < menu.children.length; i++) {
                $scope.addArticleIds(ids, menu.children[i]);
            }
        }
    };

    $scope.findAll();
}]);

iGitrasMason.controller('ArticleController', ['$scope', '$routeParams', 'ArticleService', 'Session', function ($scope, $routeParams, ArticleService, Session) {
    $scope.pageInfo = {
        title: "",
        keywords: "",
        desc: ""
    };

    $scope.loadArticle = function (id) {
        ArticleService.loadArticle($routeParams.id).success(
            function (data, status, headers, config) {
                $scope.id = data.id;
                alert(JSON.stringify(data.header));
                $scope.header = data.header;
                $scope.content = data.content;

                $scope.pageInfo.title = $scope.header.title;
                $scope.pageInfo.keywords = $scope.buildKeywords($scope.header);
                $scope.pageInfo.desc = $scope.header.desc;
                $scope.$emit('event:title-Updated', $scope.pageInfo);

                $scope.isTranslate = !(($scope.header.translator === undefined) || ($scope.header.translator === null) || ($scope.header.translator === ''));
            }
        );
    };

    $scope.buildKeywords = function (data) {
        var str = '';
        var i = data.tags.length;
        while (i-- > 0) {
            str += data.tags[i - 1] + ', ';
        }

        if (!!data.translator) {
            str += data.translator + ', ';
        }

        if (!!data.author) {
            str += data.author.name + ', ';
        }

        str += data.title;
        return str;
    };

    $scope.hasPrevious = function () {
        return $routeParams.id > Session.minArticleId;
    };
    $scope.hasNext = function () {
        return $routeParams.id < Session.maxArticleId;
    };

    $scope.loadArticle();
}]);

iGitrasMason.controller('LatestArticles', ['$scope', 'ArticleService', function ($scope, ArticleService) {
    $scope.latestSize = 2;

    $scope.loadLatestArticles = function () {
        ArticleService.loadArticles().success(
            function (data, status, headers, config) {
                $scope.latestArts = [];

                var counter = 0;
                for (var i = 0; i < data.length; i++) {
                    if (counter < $scope.latestSize) {
                        counter++;
                        $scope.latestArts.push(data[i]);
                    }
                }
            }
        );
    };
    $scope.reload = function(){
        $scope.loadLatestArticles();
    };

    $scope.loadLatestArticles();
}]);
