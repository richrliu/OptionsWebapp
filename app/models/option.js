var mongoose = require('mongoose');

// var optionsSchema = new mongoose.Schema({
//     scrapeDate: Date,
//     type: String,
//     expiry: String,
//     last: Number,
//     change: Number,
//     bid: Number,
//     ask: Number,
//     vol: Number,
//     openInterest: Number,
//     strike: Number,
//     ticker: String,
//     delta: Number,
//     gamma: Number,
//     rho: Number,
//     theta: Number,
//     vega: Number,
//     iv: Number
// });
//
var optionsSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Option', optionsSchema);
