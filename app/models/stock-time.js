var mongoose = require('mongoose');

module.exports = mongoose.model('StockTime', {
    ticker : {type : String, default: ''},
    name : {type : String, default: ''},
    date : {type : Date},
    price : {type : Number}
});