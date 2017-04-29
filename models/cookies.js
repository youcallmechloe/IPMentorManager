
var mongoose = require('mongoose');

var CookieSchema = new mongoose.Schema({
    username : String,
    sessionID : String
});

module.exports = mongoose.model('cookies', CookieSchema, 'cookies');