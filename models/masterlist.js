/**
 * Created by root on 01/02/2017.
 */
var mongoose = require('mongoose');
var MasterListSchema = new mongoose.Schema({
    words : []
});

module.exports = mongoose.model('masterlist', MasterListSchema, 'masterlist');