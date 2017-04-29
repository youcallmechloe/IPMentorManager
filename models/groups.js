
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    groupname : String,
    description : String,
    admin : String,
    members : [],
    posts : [{
        post: String,
        username: String,
        time: String,
        date: String,
        replies : []
    }]
});

module.exports = mongoose.model('groups', GroupSchema, 'groups');