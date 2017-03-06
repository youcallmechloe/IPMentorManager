/**
 * Created by root on 01/02/2017.
 */
var mongoose = require('mongoose');

var WordSchema = new mongoose.Schema({
    word : '',
    category : '',
    users : []
});

module.exports = mongoose.model('words', WordSchema);