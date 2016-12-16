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
    $scope.display = [{ data: true, reg: false }];

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

    function handleClick(x, y) {
        console.log($scope.xVar + ": " + x);
        console.log($scope.yVars[0] + ": " + y)
    }


    $scope.chartConfig = {
        options: {
            chart: {
                type: 'scatter',
                events: {
                    click: function(e) {
                        var x = e.xAxis[0].value;
                        var y = e.yAxis[0].value;
                        handleClick(x, y);
                    }
                }
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: true
            },
            plotOptions: {
                series: {
                    lineWidth: 1,
                    point: {
                        events: {
                            click: function() {
                                handleClick(this.x, this.y);
                            }
                        }
                    }
                }
            }
        },
        xAxis: {
            title: {
                text: $scope.xVar
            },
            gridLineWidth: 1,
            minPadding: 0.2,
            maxPadding: 0.2
        },
        yAxis: {
            title: {
                text: $scope.yVars.join(", ")
            },
            minPadding: 0.2,
            maxPadding: 0.2,
        },
        series: []
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
            var series = [];
            $scope.yVars.forEach(function(yVar, yVarI) {
                var dataPoints = resp.data.options.map(function(val) {
                    return [getFunction($scope.xVar)(val), getFunction(yVar)(val)]
                });
                dataPoints = dataPoints.sort(function(a, b) {
                    return a[0] - b[0];
                });
                if ($scope.display[yVarI].data) {
                    series.push({
                        data: dataPoints,
                        name: yVar
                    });
                }
                if ($scope.display[yVarI].reg) {
                    var a = regression('polynomial', dataPoints, 6);

                    series.push({
                        data: a.points,
                        name: yVar + " (regression)"
                    });
                }
            });

            $scope.chartConfig.series = series;
            $scope.chartConfig.title = {
                text: $scope.ticker + ": " + $scope.xVar + " vs " + $scope.yVars.join(", ")
            };
            $scope.chartConfig.xAxis.title.text = $scope.xVar;
            $scope.chartConfig.yAxis.title.text = $scope.yVars.join(", ");

            $scope.displayGraph = true;
        });
    }

    $scope.addYVar = function() {
        $scope.yVars.push("delta");
        $scope.display.push({ data: false, reg: true });
    }

    $scope.$watch('xVar', $scope.updateData);
    $scope.$watch('yVars', $scope.updateData, true);
    $scope.$watch('display', $scope.updateData, true);
    $scope.$watch('expiry', $scope.updateData);
    $scope.$watch('type', $scope.updateData);

});
