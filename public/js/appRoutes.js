angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // nerds page that will use the NerdController
        .when('/stock-time', {
            templateUrl: 'views/stock-time.html',
            controller: 'StockTimeController'
        });

    $locationProvider.html5Mode(true);

}]);