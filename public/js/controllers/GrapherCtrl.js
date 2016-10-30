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
        "iv",
        "premium",
        "break-even",
        "bid+strike",
        "ask+strike"
    ];

    $scope.optionTypes = ["call", "put"];
    $scope.type = "call";

    $scope.displayGraph = false;
    $scope.xVar = "strike";
    $scope.yVars = ["delta"];
    $scope.display = [{ scatter: true, reg: false }];

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

    function getFunction(v) {
        switch (v) {
            case "premium":
                return (function(d) {
                    return (d["bid"] + d["ask"]) / 2.0;
                });
            case "break-even":
                return (function(d) {
                    return d["strike"] + (d["bid"] + d["ask"]) / 2.0;
                });
            case "bid+strike":
                return (function(d) {
                    return d["strike"] + d["bid"];
                });
            case "ask+strike":
                return (function(d) {
                    return d["strike"] + d["ask"];
                });
            default:
                return (function(d) {
                    return d[v]
                });
        }
    }

    $scope.updateData = function() {
        if (!($scope.expiry && $scope.ticker && $scope.type)) return;
        $http({
            method: 'get',
            url: '/api/options',
            params: {
                ticker: $scope.ticker,
                expiry: $scope.expiry,
                type: $scope.type
            }
        }).then(function(resp) {
            $scope.data = [];
            $scope.yVars.forEach(function(yVar, yVarI) {
                var dataPoints = resp.data.options.map(function(val) {
                    return [getFunction($scope.xVar)(val), getFunction(yVar)(val)]
                });
                if ($scope.display[yVarI].scatter) {
                    $scope.data.push({
                        values: dataPoints,
                        key: yVar,
                        area: false
                    });
                }
                if ($scope.display[yVarI].reg) {
                    var a = regression('polynomial', dataPoints, 6);
                    // var a = a.equation;
                    // var regressionPoints = []
                    // dataPoints.forEach(function(val, i) {
                    //     var x = val[0]
                    //     var nextX = i < dataPoints.length - 1 ? dataPoints[i + 1][0] : val[0];
                    //     var step = (nextX - x) / 10.0;
                    //     for (var currX = x; currX < nextX; currX += step) {
                    //         var value = [x, 0];
                    //         a.forEach(function(asdf, i) {
                    //             value[1] += a[i] * Math.pow(val[0], i);
                    //         });
                    //         regressionPoints.push(value);
                    //     }
                    //
                    // });
                    $scope.data.push({
                        values: a.points,
                        key: yVar + " (regression)",
                        area: false
                    });
                }
            });
            $scope.options = {
                chart: {
                    type: "scatterChart",
                    height: 500,
                    useInteractiveGuideline: true,
                    scatter: {
                        onlyCircles: false
                    },
                    xAxis: {
                        axisLabel: $scope.xVar
                    },
                    yAxis: {
                        axisLabel: $scope.yVars
                    },
                    x: function(d) {
                        return d[0];
                    },
                    y: function(d) {
                        return d[1];
                    },
                    zoom: {
                        enabled: true,
                        scaleExtent: [
                            1,
                            10
                        ],
                        useFixedDomain: true,
                        useNiceScale: false,
                        horizontalOff: false,
                        verticalOff: false,
                        unzoomEventType: "dblclick.zoom"
                    }
                },
                title: {
                    enable: true,
                    text: $scope.ticker + ": " + $scope.xVar + " vs " + $scope.yVars
                },
            }
            $scope.displayGraph = true;
        });
    }

    $scope.addYVar = function() {
        $scope.yVars.push("delta");
        $scope.display.push({ scatter: false, reg: true });
    }

    $scope.$watch('xVar', $scope.updateData);
    $scope.$watch('yVars', $scope.updateData, true);
    $scope.$watch('display', $scope.updateData, true);
    $scope.$watch('expiry', $scope.updateData);
    $scope.$watch('type', $scope.updateData);

});
