var StockTime = require('./models/stock-time');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/stock-time', function(req, res) {
        // use mongoose to get all nerds in the database
        StockTime.find(function(err, stockTimes) {
            if (err) res.send(err);

            res.json(stockTimes);
        });
    });

    // route to handle creating goes here (app.post)
    app.post('/api/stock-time/create/', function(req, res) {
        var ticker = req.query.ticker;
        var name = req.query.name;
        var date = req.query.date;
        var price = req.query.price;

        StockTime.create({ticker: ticker, name: name, date: date, price: price}, function (err, stocktime) {
            if (err) console.log(err);
            console.log(ticker);
        });
    });

    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};