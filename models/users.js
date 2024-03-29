
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    fullname : String,
    age : Number,
    gender : String,
    degree : String,
    userscore: Number,
    scoresmade : [{
        username: String,
        score : Number
    }],
    level : String,
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