angular.module('optionsApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

    // home page
        .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    })

    .when('/grapher', {
        templateUrl: 'views/grapher.html',
        controller: 'GrapherController'
    })

    .when('/scraper', {
        templateUrl: 'views/scraper.html',
        controller: 'ScraperController'
    })

    .when('/stock-time', {
        templateUrl: 'views/stock-time.html',
        controller: 'StockTimeController'
    });

    $locationProvider.html5Mode(true);

}]);
