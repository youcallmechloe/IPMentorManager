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

/** matching algorithm to be used by a user with search requirements - first implementation, basic and very slow, not scalable
 */
router.post('/matching1', function(req, res){
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

/** matching algorithm to be used by a user with search requirements - second implementation, using word list inside
    users, hopefully more scalable than first as it gets rid of one db call, also getting exist bool for words from front end
    so gets rid of another db call
 */
router.post('/matching2', function(req, res){
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
                cb1(null, userList, body['interests'], body);
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
                    cb4(wordlist);
                }
            };
            asyncLoop(0, function (res) {
                console.log(wordlist);
                cb3(null, users, res, body);
            });
        },
        function (users, wordlist, body, cb5) {
            for (var j = 0; j < wordlist.length; j++) {
                for (var v = 0; v < users.length; v++) {
                    for(var i = 0; i < users[v]['knowledge'].length; i++){
                        if(users[v]['knowledge'][i]['word'] === wordlist[j]['word'] &&
                            users[v]['knowledge'][i]['category'] === wordlist[j]['category']){
                            users[v]['score'] = users[v]['score'] + wordlist[j]['score'];
                        }
                    }
                }
            }

            cb5(null, users);
        }
    ], function (err, result) {
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

/** matching algorithm incorporating the Jaccard coefficient as the users score (final function), if using the datamuse part (function2)
 * the coefficient will be tiny as there will be many many words that users do not have
 */
router.post('/matching3', function(req, res){
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
                cb1(null, userList, body['interests'], body);
            });

        },
        // function(users, wordlist, body, cb3){
        //     var asyncLoop = function(i, cb4){
        //         if(i < wordlist.length){
        //             global.category = wordlist[i]['category'];
        //             if(wordlist[i]['bool'] === false){
        //                 datamuse.words({
        //                     ml : wordlist[i]['word']
        //                 }).then( function(response){
        //                     var body = response.slice(0,19);
        //                     var highestScore = body[0]['score'];
        //                     for(var j = 0; j < body.length; j++){
        //                         wordlist.push({'word' : body[j]['word'], 'category' : category, 'score' : 0.5*(body[j]['score']/highestScore), 'bool' : true})
        //                     }
        //                     asyncLoop(i+1, cb4);
        //                 });
        //             } else{
        //                 asyncLoop(i+1, cb4);
        //             }
        //         } else {
        //             cb4(wordlist);
        //         }
        //     };
        //     asyncLoop(0, function (res) {
        //         cb3(null, users, res, body);
        //     });
        // },
        function (users, wordlist, body, cb5) {
            for (var v = 0; v < users.length; v++) {
                var intersection = [];
                var union = [];

                for (var j = 0; j < wordlist.length; j++) {
                    if(!_.contains(union, wordlist[j]['word'])) {
                        union.push(wordlist[j]['word']);
                    }

                    for(var i = 0; i < users[v]['knowledge'].length; i++){
                        if(users[v]['knowledge'][i]['word'] === wordlist[j]['word'] &&
                            users[v]['knowledge'][i]['category'] === wordlist[j]['category']){
                            intersection.push(wordlist[j]['word']);
                        }
                        if(!_.contains(union, users[v]['knowledge'][i]['word'])){
                            union.push(users[v]['knowledge'][i]['word']);
                        }
                    }
                }
                console.log(users[v]['username'] + " " + intersection.length + " " + union.length)
                users[v]['score'] = ((intersection.length)/(union.length));
                console.log(((intersection.length)/(union.length)))
            }
            cb5(null, users);
        }
    ], function (err, result) {
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

module.exports = router;
