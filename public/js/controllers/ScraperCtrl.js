angular.module('optionsApp').controller('ScraperController', function($scope, $http) {

    $scope.scrape = function(ticker) {
        $http({
            method: 'POST',
            url: '/api/scrape',
            data: {
                ticker: ticker
            }
        }).then(function() {
            $scope.responseText = "New Scrape Queued Successfully, data should be available in <15min";
        });
    }
});
