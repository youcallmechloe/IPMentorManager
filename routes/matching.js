/**
 * Created by root on 15/02/2017.
 */

var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');
var datamuse = require('datamuse');
var _ = require('underscore');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var UserSchema = require('../models/users');
var MasterList = require('../models/masterlist');
var WordSchema = require('../models/words');

router.post('/getwords', function(req, res){
    var db = req.db;
    var collection = db.get('masterlist');
    var body = req.body;

    collection.find({}, function(e,docs){
        var words = [];

        for(var i = 0; i < docs[0]['words'].length; i++){
            var dbWord = docs[0]['words'][i].toUpperCase();
            var searchWord = body['word'].toUpperCase();
            if(dbWord.includes(searchWord)){
                console.log(dbWord);
                words.push(docs[0]['words'][i]);
            }
        }
        res.send(words);
    });
});

//TODO: actually write properly
//expect JSON to come in as {'username':'', 'gender': '', 'age range': '', 'interests' : [{'word' : '', 'category' : ''}]} will probs add more fields
router.post('/matching', function(req, res){
    var body = req.body;
    var interests = body['interests'];
    global.userGet = [];

    async.series([
        function(callback){
        console.log('starting');
        UserSchema.find({'age': {$lte: body['age']}}, function (e, userlist) {
            global.users = userlist;
            for(var i = 0; i < users.length; i++) {
                global.user = users[i];
                if ((users[i]['gender'] === body['gender']) || (body['gender'] === 'none')) {
                    // console.log(user);

                    for(var j = 0; j < interests.length; j++){
                        global.category = interests[j]['category'];
                        global.word = interests[j]['word'];

                        MasterList.find({'words' : interests[j]['word']}, function(e, docs){
                            if(docs !== undefined){
                                WordSchema.find({'category.name' : category, 'category.words.name' : word}, function(e, docs){
                                    global.user = {
                                        'username' : user['username'],
                                        'email' : user['email'],
                                        'fullname' : user['fullname'],
                                        'age' : user['age'],
                                        'gender' : user['gender'],
                                        'degree' : user['degree'],
                                        'knowledge' : user['knowledge'],
                                        'score' : 1
                                    };

                                    if(userGet.length === 0){
                                        userGet.push(user);
                                    } else {
                                        for (var u = 0; u < userGet.length; u++) {
                                            if (userGet[u]['username'] === user['username']) {
                                                userGet[u]['score'] = userGet[u]['score'] + 1;
                                            } else {
                                                userGet.push(user);
                                            }
                                        }
                                        console.log("sdfss")
                                    }
                                    console.log(userGet);
                                });
                            }
                        })
                    }
                }
            }
            console.log(userGet);
            callback(null, userGet);
        });
    }], function(err, result){
        console.log(result);
        res.send(userGet);
    });

});

router.post('/matchingnew', function(req, res){
    var body = req.body;
    var interests = body['interests'];
    async.waterfall([
        function(cb1){
            global.userList = [];
            UserSchema.find({'age': {$lte: body['age']}}, function (e, users) {
                if(users !== undefined) {
                    for (var i = 0; i < users.length; i++) {
                        if ((users[i]['gender'] === body['gender']) || (body['gender'] === 'none')) {
                            var user = {
                                'username': users[i]['username'],
                                'email': users[i]['email'],
                                'fullname': users[i]['fullname'],
                                'age': users[i]['age'],
                                'gender': users[i]['gender'],
                                'degree': users[i]['degree'],
                                'knowledge': users[i]['knowledge'],
                                'score': 0
                            };
                            userList.push(user);
                        }
                    }
                }
                cb1(null, userList, body);
            });

        },
        function(userlist, body, cb2){
            global.wordList = [];
            var interests = body['interests'];
            MasterList.find(function(e, docs) {
                for(var j = 0; j < interests.length; j++){
                    if(_.contains(docs[0]['words'], interests[j]['word'])){
                        wordList.push({'word' : interests[j]['word'], 'category' : interests[j]['category'], 'bool' : true});
                    } else{
                        wordList.push({'word' : interests[j]['word'], 'category' : interests[j]['category'], 'bool' : false});
                    }
                }
                cb2(null, userlist, wordList, body);
            });
        },
        function(users, wordlist, body, cb3){
            var asyncLoop = function(i, cb4){
                if(i < wordlist.length){
                    global.category = wordlist[i]['category'];
                    if(wordlist[i]['bool'] === false){
                        var similarWords = [];
                        datamuse.words({
                            ml : wordlist[i]['word']
                        }).then( function(response){
                            var body = response.slice(0,19);
                            for(var j = 0; j < body.length; j++){
                                wordlist.push({'word' : body[j]['word'], 'category' : category, 'bool' : true})
                            }
                            asyncLoop(i+1, cb4);
                        });
                    } else{
                        asyncLoop(i+1, cb4);
                    }
                } else{
                    cb4(wordlist);
                }
            }
            asyncLoop(0, function(res){
                cb3(null, users, res, body);
            });
        },
        function (users, wordlist, body, cb5) {
            WordSchema.find(function (e, docs) {
                for (var j = 0; j < wordlist.length; j++) {
                    for (var i = 0; i < docs.length; i++) {
                        if ((docs[i]['category']['name'] === wordlist[j]['category'])) {
                            for(var c = 0; c < docs[i]['category']['words'].length; c++){
                                if(docs[i]['category']['words'][c]['name'] === wordlist[j]['word']){
                                    for(var u = 0; u < docs[i]['category']['words'][c]['users'].length; u++) {
                                        for(var v = 0; v < users.length; v++){
                                            if(docs[i]['category']['words'][c]['users'][u] === users[v]['username']){
                                                users[v]['score'] = users[v]['score'] + 1;
                                            }
                                        }
                                        //find users then append score in userlist
                                        //if using datamuse generated word then times score given by certain number to obtain lower score!
                                    }
                                }
                            }
                        }
                    }
                }
                cb5(null, users);
            });
        }
    ], function (err, result) {
        res.send(result);
    });
});


var getSimilarWords = function(word){
    var wordsList = [];
    http.request('http://api.datamuse.com/words?ml=' + word, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body).slice(0, 19);
            for(var i = 0; i < body.length; i++){
                var object = body[i];
                wordsList.push(object['word']);
            }
        }
    }).end();
    console.log(wordsList)

    return wordsList;
};

module.exports = router;
