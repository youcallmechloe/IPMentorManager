/*
 * Node.js file that uses express to deal with the matching algorithm.
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
var Cookie = require('../models/cookies');

//gets all words containing passed parameter word and returns them
router.post('/getwords', function(req, res){
    var body = req.body;

    WordSchema.find({}, function(e, docs){
        var words = [];
        for(var i = 0; i < docs.length; i++){
            var dbword = docs[i]['word'].toUpperCase();
            var searchword = body['word'].toUpperCase();
            if(dbword.includes(searchword)){
                words.push({'word' : docs[i]['word'], 'category' : docs[i]['category']});
            }
        }
        res.send(words);
    });
});

//method that adds partners to user's lists and puts statuses on to showing pending or requested partners
router.post('/requestpartner', function(req, res){
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        if(docs.length > 0) {
            async.waterfall([
                function(cb1){
                    UserSchema.update({'username': body['username']}, {$push : {'workpartners' : {'username' : body['partner'], 'status' : 'pending', 'relation' : body['partnerstatus']}}}, function(e, docs){
                        cb1(null, body);
                    });
                },
                function(body, cb2){
                    UserSchema.update({'username' : body['partner']}, {$push : {'workpartners' : {'username' : body['username'], 'status' : 'requested', 'relation' : body['theirstatus']}}}, function(e, docs){
                        cb2(null);
                    });
                }
            ], function (err, result) {
                res.send("");
            });
        } else{
            res.send("");
        }
    });

});

//method to accept a partner, changes statuses of partners in user's lists
router.post('/acceptpartner', function(req, res){
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        if(docs.length > 0) {

            async.waterfall([
                function(cb1){
                    UserSchema.update({'username': body['username']}, {$push : {'workpartners' : {'username' : body['partnername'], 'status' : 'current', 'relation' : body['relation']}}},  function(e, docs){
                        cb1(null, body);
                    });
                },
                function(body, cb2){
                    UserSchema.update({'username' : body['partnername']}, {$push : {'workpartners' : {'username' : body['username'], 'status' : 'current', 'relation' : body['partnerrelation']}}}, function(e, docs){
                        cb2(null, body);
                    });
                },
                function(body, cb3){
                    UserSchema.update({'username' : body['partnername']}, {$pull : {'workpartners' : {'username' : body['username'], 'status' : 'pending', 'relation' : body['partnerrelation']}}}, function(e, docs){
                        cb3(null, body);
                    });
                },
                function(body, cb4){
                    UserSchema.update({'username' : body['username']}, {$pull : {'workpartners' : {'username' : body['partnername'], 'status' : 'requested', 'relation' : body['relation']}}}, function(e, docs){
                        cb4(null);
                    });
                }
            ], function (err, result) {
                res.send("");
            });
        } else{
            res.send("");
        }
    });
});

//returns all partners associated with a user
router.post('/getpartners', function(req, res){
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        if(docs.length > 0) {
            UserSchema.find({'username' : body['username']}, function(e, docs){
                res.send(docs[0]['workpartners']);
            })
        } else{
            res.send("");
        }
    });
});

/** matching algorithm to be used by a user with search requirements - first implementation, basic and very slow, not scalable
 */
router.post('/matching1', function(req, res){
    var body = req.body;
    var interests = body['interests'];

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs){
        if(docs.length > 0){
            async.waterfall([
                function(cb1){
                    global.userList = [];
                    UserSchema.find({'age': {$lte: body['maxAge'], $gte: body['minAge']}}, function (e, users) {
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
                                        'wordpartners' : user[i]['workpartners'],
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
                    if(body['similar'] === true) {
                        var asyncLoop = function (i, cb4) {
                            if (i < wordlist.length) {
                                global.category = wordlist[i]['category'];
                                if (wordlist[i]['bool'] === false) {
                                    datamuse.words({
                                        ml: wordlist[i]['word']
                                    }).then(function (response) {
                                        var body = response.slice(0, 19);
                                        var highestScore = body[0]['score'];
                                        for (var j = 0; j < body.length; j++) {
                                            wordlist.push({
                                                'word': body[j]['word'],
                                                'category': category,
                                                'score': 0.5 * (body[j]['score'] / highestScore),
                                                'bool': true
                                            })
                                        }
                                        asyncLoop(i + 1, cb4);
                                    });
                                } else {
                                    asyncLoop(i + 1, cb4);
                                }
                            } else {
                                cb4(wordlist);
                            }
                        };
                        asyncLoop(0, function (res) {
                            cb3(null, users, res, body);
                        });
                    } else{
                        cb3(null, users, wordlist, body);
                    }
                },
                function (users, wordlist, body, cb5) {
                    WordSchema.find(function (e, docs) {
                        for (var j = 0; j < wordlist.length; j++) {
                            for (var i = 0; i < docs.length; i++) {
                                if ((docs[i]['word'] === wordlist[j]['word']) && (docs[i]['category'] === wordlist[j]['category'])) {
                                    for (var v = 0; v < users.length; v++) {
                                        if (_.contains(docs[i]['users'], users[v]['username'])) {
                                            users[v]['score'] = users[v]['score'] + wordlist[j]['score'];
                                        }
                                    }
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
        } else{
            res.send("");
        }
    });
});

/** matching algorithm to be used by a user with search requirements - second implementation, using word list inside
    users, hopefully more scalable than first as it gets rid of one db call, also getting exist bool for words from front end
    so gets rid of another db call
 */
//TODO: add in cookie check
router.post('/matching2', function(req, res) {
    var body = req.body;
    var interests = body['interests'];

    //check cookies to confirm request coming from user
    Cookie.find({'username': body['username'], 'sessionid': body['sessionID']}, function (e, docs) {
        if (docs.length > 0) {
            async.waterfall([
                function (cb1) {
                    global.userList = [];
                    UserSchema.find({'age': {$lte: body['maxAge'], $gte: body['minAge']}}, function (e, users) {
                        if (users !== undefined) {
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
                function (users, wordlist, body, cb3) {
                    if(body['similar'] === true) {
                        var asyncLoop = function (i, cb4) {
                        if (i < wordlist.length) {
                            global.category = wordlist[i]['category'];
                            if (wordlist[i]['bool'] === false) {
                                datamuse.words({
                                    ml: wordlist[i]['word']
                                }).then(function (response) {
                                    var body = response.slice(0, 19);
                                    var highestScore = body[0]['score'];
                                    for (var j = 0; j < body.length; j++) {
                                        wordlist.push({
                                            'word': body[j]['word'],
                                            'category': category,
                                            'score': 0.5 * (body[j]['score'] / highestScore),
                                            'bool': true
                                        })
                                    }
                                    asyncLoop(i + 1, cb4);
                                });
                            } else {
                                asyncLoop(i + 1, cb4);
                            }
                        } else {
                            cb4(wordlist);
                        }
                    };
                    asyncLoop(0, function (res) {
                        cb3(null, users, res, body);
                    });
                    } else{
                        cb3(null, users, wordlist, body);
                    }
                },
                function (users, wordlist, body, cb5) {
                    for (var j = 0; j < wordlist.length; j++) {
                        for (var v = 0; v < users.length; v++) {
                            for (var i = 0; i < users[v]['knowledge'].length; i++) {
                                if (users[v]['knowledge'][i]['word'] === wordlist[j]['word'] &&
                                    users[v]['knowledge'][i]['category'] === wordlist[j]['category']) {
                                    users[v]['score'] = users[v]['score'] + wordlist[j]['score'];
                                }
                            }
                        }
                    }

                    cb5(null, users);
                }
            ], function (err, result) {
                function compare(a, b) {
                    if (a.score > b.score)
                        return -1;
                    if (a.score < b.score)
                        return 1;
                    return 0;
                }

                result.sort(compare);
                var finalresult = result.splice(0, 10);
                var newfinal = [];
                for(var i = 0; i < finalresult.length; i++) {
                    if (finalresult[i]['username'] !== body['username']) {
                        if (finalresult[i]['score'] !== 0) {
                            newfinal.push(finalresult[i]);
                        }
                    }
                }
                res.send(newfinal);
            });
        } else {
            res.send("");
        }
    });
});

/** matching algorithm incorporating the Jaccard coefficient as the users score (final function), if using the datamuse part (function2)
 * the coefficient will be tiny as there will be many many words that users do not have
 */
//TODO: add in cookie check
router.post('/matching3', function(req, res){
    var body = req.body;
    var interests = body['interests'];
    async.waterfall([
        function(cb1){
            global.userList = [];
            UserSchema.find({'age': {$lte: body['maxAge'], $gte: body['minAge']}}, function (e, users) {
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
                                'score': 0,
                                'exists': 'No'
                            };
                            userList.push(user);
                        }
                    }
                }
                cb1(null, userList, body['interests'], body);
            });

        },
        function(users, wordlist, body, cb3){
            if(body['similar'] === true) {
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
            } else{
                cb3(null, users, wordlist, body);
            }
        },
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
                users[v]['score'] = ((intersection.length)/(union.length));
            }
            cb5(null, users, body);
        }
    ], function (err, result, body) {
        function compare(a, b){
            if (a.score > b.score)
                return -1;
            if (a.score < b.score)
                return 1;
            return 0;
        }
        result.sort(compare);
        var finalresult = result.splice(0,10);
        var newfinal = [];

        for(var i = 0; i < finalresult.length; i++) {
            if (finalresult[i]['username'] !== body['username']) {
                if (finalresult[i]['score'] !== 0) {
                    if(body['partners'].length > 0) {
                        for (var j = 0; j < body['partners'].length; j++) {
                            // finalresult[i]['score'] = Number(Math.round((parseInt(finalresult[i]['score']))*100)/100);
                            finalresult[i]['score'] = roundNumber(finalresult[i]['score'], 2);
                            if (finalresult[i]['username'] === body['partners'][j]['username']) {
                                finalresult[i]['exists'] = body['partners'][j]['relation'];
                            }
                        }
                        newfinal.push(finalresult[i]);
                    } else{
                        newfinal.push(finalresult[i]);
                    }
                }
            }
        }
        res.send(newfinal);
    });
});

function roundNumber(num, scale) {
    if(!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
        var arr = ("" + num).split("e");
        var sig = ""
        if(+arr[1] + scale > 0) {
            sig = "+";
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
}

module.exports = router;
