angular.module('optionsApp').controller('GrapherController', function($scope, $http) {
    $scope.optionKeys = [
        "expiry",
        "last",
        "change",
        "bid",
        "ask",
        "vol",
        "openInterest",
        "strike",
        "delta",
        "gamma",
        "rho",
        "theta",
        "vega",
        "iv"
    ];

    $scope.optionTypes = ["call", "put"];
    $scope.type = "call";

    $scope.displayGraph = false;
    $scope.xVar = "strike";
    $scope.yVar = "delta";

    $http({
        method: 'get',
        url: '/api/tickers',
    }).then(function(resp) {
        $scope.tickers = resp.data.tickers;
        $scope.ticker = $scope.tickers[0];
    });

    $scope.$watch('ticker', function(val) {
        $http({
            method: 'get',
            url: '/api/expiries',
            params: {
                ticker: val
            }
        }).then(function(resp) {
            $scope.expiries = resp.data.expiries;
            $scope.expiry = $scope.expiries[0];
            $scope.updateData();
        });
    });

    $scope.updateData = function() {
        console.log($scope.expiry);
        console.log($scope.ticker);
        $http({
            method: 'get',
            url: '/api/options',
            params: {
                ticker: $scope.ticker,
                expiry: $scope.expiry,
                type: $scope.type
            }
        }).then(function(resp) {
            $scope.data = [{
                values: resp.data.options.filter(function(d) {
                    return d[$scope.xVar] && d[$scope.yVar] && d[$scope.xVar] !== NaN && d[$scope.yVar] !== NaN;
                }),
                key: $scope.ticker,
                area: false
            }];
            $scope.options = {
                chart: {
                    type: "scatterChart",
                    height: 500,
                    useInteractiveGuideline: true,
                    xAxis: {
                        axisLabel: $scope.xVar
                    },
                    yAxis: {
                        axisLabel: $scope.yVar
                    },
                    x: function(d) {
                        return d[$scope.xVar];
                    },
                    y: function(d) {
                        return d[$scope.yVar];
                    }
                },
                title: {
                    enable: true,
                    text: $scope.ticker + ": " + $scope.xVar + " vs " + $scope.yVar
                },
            }
            $scope.displayGraph = true;
        });
    }

    $scope.$watch('xVar', $scope.updateData);
    $scope.$watch('yVar', $scope.updateData);
    $scope.$watch('expiry', $scope.updateData);
    $scope.$watch('type', $scope.updateData);
});
