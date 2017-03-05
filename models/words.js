/**
 * Created by root on 01/02/2017.
 */
var mongoose = require('mongoose');

var WordSchema = new mongoose.Schema({
    category : {
        name : String,
        words : [{
            name : String,
            users : []
        }]
    }
});

module.exports = mongoose.model('words', WordSchema, 'words');