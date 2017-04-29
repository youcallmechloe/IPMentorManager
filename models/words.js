
var mongoose = require('mongoose');

var WordSchema = new mongoose.Schema({
    word : String,
    category : String,
    users : []
});

module.exports = mongoose.model('words', WordSchema, 'words');