/**
 * Created by root on 01/02/2017.
 */
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    groupname : String,
    description : String,
    admin : String,
    members : [],
    posts : [{
        post: String,
        username: String,
        replies : []
    }]
});

module.exports = mongoose.model('groups', GroupSchema, 'groups');