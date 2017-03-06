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
var WordSchema = require('../models/words');

router.post('/getwords', function(req, res){
    var body = req.body;

    WordSchema.find({}, function(e, docs){
        var words = [];
        for(var i = 0; i < docs.length; i++){
            var dbword = docs[i]['word'].toUpperCase();
            var searchword = body['word'].toUpperCase();
            if(dbword.includes(searchword)){
                words.push(docs[i]['word']);
            }
        }
        res.send(words);
    });
});

//TODO: make more efficient!! & make more readable
//matching algorithm to be used by a user with search requirements
router.post('/matching', function(req, res){
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

            WordSchema.find(function (e, docs) {
                var dbList = [];
                for (var i = 0; i < docs.length; i++) {
                    dbList.push(docs[i]['word']);
                }

                for (var j = 0; j < interests.length; j++) {
                    if (_.contains(dbList, interests[j]['word'])) {
                        wordList.push({
                            'word': interests[j]['word'],
                            'category': interests[j]['category'],
                            'score' : 1,
                            'bool': true
                        });
                    } else {
                        wordList.push({
                            'word': interests[j]['word'],
                            'category': interests[j]['category'],
                            'score' : 1,
                            'bool': false
                        });
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
                        datamuse.words({
                            ml : wordlist[i]['word']
                        }).then( function(response){
                            var body = response.slice(0,19);
                            var highestScore = body[0]['score'];
                            for(var j = 0; j < body.length; j++){
                                wordlist.push({'word' : body[j]['word'], 'category' : category, 'score' : 0.5*(body[j]['score']/highestScore), 'bool' : true})
                            }
                            asyncLoop(i+1, cb4);
                        });
                    } else{
                        asyncLoop(i+1, cb4);
                    }
                } else {
                    console.log(wordlist);
                    cb4(wordlist);
                }
            };
            asyncLoop(0, function (res) {
                cb3(null, users, res, body);
            });
        },
        function (users, wordlist, body, cb5) {
            WordSchema.find(function (e, docs) {
                for (var j = 0; j < wordlist.length; j++) {
                    for (var i = 0; i < docs.length; i++) {
                        if ((docs[i]['word'] === wordlist[j]['word']) && (docs[i]['category'] === wordlist[j]['category'])) {
                            for (var v = 0; v < users.length; v++) {
                                if (_.contains(docs[i]['users'], users[v]['username'])) {
                                    users[v]['score'] = users[v]['score'] + 1;
                                }
                            }
                            //if using datamuse generated word then times score given by certain number to obtain lower score!
                        }

                    }
                }
                cb5(null, users);
            });
        }
    ], function (err, result) {
        //TODO: sort users by score and only send top 5?

        function compare(a, b){
            if (a.score > b.score)
                return -1;
            if (a.score < b.score)
                return 1;
            return 0;
        }
        result.sort(compare);
        var finalresult = result.splice(0,5);
        res.send(finalresult);
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
