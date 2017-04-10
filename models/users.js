/**
 * Created by root on 01/02/2017.
 */
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    fullname : String,
    age : Number,
    gender : String,
    degree : String,
    knowledge : [{
        word : String,
        category : String
    }],
    workpartners : [{
        username: String,
        status: String,
        relation : String
    }]
});

module.exports = mongoose.model('userlist', UserSchema, 'userlist');