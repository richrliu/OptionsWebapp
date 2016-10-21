angular.module('StockTimeService', []).factory('Stock-Time', ['$http', function($http) {

    return {
        // call to get all stock times
        get : function() {
            return $http.get('/api/stock-time');
        },


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        create : function(stockTimeData) {
            return $http.post('/api/stock-time/create', stockTimeData);
        },
    }       

}]);