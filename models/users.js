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
    knowledge : Array,
    workpartners : Array
});

module.exports = mongoose.model('userlist', UserSchema, 'userlist');