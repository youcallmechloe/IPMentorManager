/*
 * node.js file to deal with the user section of the backend, uses express to add, login, delete and update users as well as
 * checking usernames for new users.
 * also contains the matching algorithm for now
 * todo: move matching algorithm to it's own file!! probs
 */

var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var randomstring = require('randomstring');
var userschema = require('../models/users');
var wordschema = require('../models/words');
var cookie = require('../models/cookies');
var _ = require('underscore');

/*
 * get userlist and returns in json to client
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * post to adduser. currently adds user's information and specified knowledge words to relevant databases
 * hashes the password with a random salt which can be easily compared with the string password.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var cookies = db.get('cookies');
    var body = req.body;
    var error = '';


    const saltrounds = 10;
    const myplaintextpassword = body['password'];
    var knowledge = [];
    if(body['knowledge'].length > 0){
        knowledge = JSON.parse(body['knowledge']);
    }
    var userknowledge = [];

    if (knowledge.length > 0) {
        for (var i = 0; i < knowledge.length; i++) {
            var obj = {'word': knowledge[i].word, 'category': knowledge[i].category};
            userknowledge.push(obj);
        }
    }

    bcrypt.hash(myplaintextpassword, saltrounds).then(function (hash) {
        var userinfo = {
            'username': body['username'],
            'email': body['email'],
            'password': hash,
            'fullname': body['fullname'],
            'age': body['age'],
            'gender': body['gender'],
            'degree': body['degree'],
            'userscore' : 0,
            'scoresmade' : [],
            'level' : 'New User',
            'knowledge': userknowledge,
            'workpartners' : []
        };
        //todo: why am i checking this twice???
        collection.find({'username': body['username']}, {}, function (e, docs) {
            if (docs.length > 0) {
                res.send('false');
                return;
            } else {
                collection.insert(userinfo, function (err, result) {
                    error = err;
                });

                var session = randomstring.generate();
                cookies.update({'username' : body['username']}, {'username' : body['username'], 'sessionid' : session}, {upsert: true});

                var wordcollection = db.get('words');

                if (knowledge.length !== undefined) {
                    for (var i = 0; i < knowledge.length; i++) {
                        wordcollection.update({'word': knowledge[i]['word'], 'category': knowledge[i]['category']},
                            {$push: {'users': body['username']}}, {upsert: true});
                    }
                }

                res.send((error !== null) ? session : error);
            }
        });

    });

});

router.post('/userinfo', function(req, res){
    var db = req.db;
    var usercollection = db.get('userlist');
    var body = req.body;
    var userinfo = [];

    cookie.find({'username' : body['username'], 'sessionid' : body['sessionid']}, function(e, docs){
        if(docs.length > 0){
            usercollection.find({'username' : body['username']}, {}, function(e, docs){
                if(docs.length > 0) {
                    var user = {
                        'username' : docs[0]['username'],
                        'email' : docs[0]['email'],
                        'fullname' : docs[0]['fullname'],
                        'age' : docs[0]['age'],
                        'gender' : docs[0]['gender'],
                        'degree' : docs[0]['degree'],
                        'degreetitle': docs[0]['degreetitle'],
                        'userscore' : docs[0]['userscore'],
                        'level' : docs[0]['level'],
                        'knowledge' : docs[0]['knowledge']
                    };
                    userinfo.push(user);
                    console.log(user);
                }

                res.send(user);
            });
        } else{
            res.send("false");
        }
    });

});

router.post('/changeinterests', function(req, res){
    var body = req.body;

    userschema.find({'username' : body['username']}, {}, function(e, docs){
        if(docs.length > 0){
            var oldknowledge = docs[0]['knowledge'];
            var newknowledge = body['knowledge'];
            userschema.update({'username' : body['username']}, {$set : {'knowledge' : newknowledge}}, function(e, docs){
                if(!e){
                    if (oldknowledge.length > 0) {
                        for (var i = 0; i < oldknowledge.length; i++) {
                            wordschema.update({
                                    'word': oldknowledge[i]['word'],
                                    'category': oldknowledge[i]['category']
                                },
                                {$pull: {'users': body['username']}}, function (e, docs) {
                                    if (e) {
                                        res.send("false");
                                    }
                                });
                        }
                    }
                    if (newknowledge.length > 0) {
                        for (var j = 0; j < newknowledge.length; j++) {
                            wordschema.update({
                                    'word': newknowledge[j]['word'],
                                    'category': newknowledge[j]['category']
                                },
                                {$push: {'users': body['username']}}, {upsert: true}, function (e, docs) {
                                    if (e) {
                                        res.send("false");
                                    }
                                });
                        }
                    }
                    res.send("");
                } else{
                    res.send('false');
                }
            });
        }
    });
});

//TODO: make work properly
router.post('/changedetails', function(req, res) {
    var body = req.body;

    cookie.find({'username': body['username'], 'sessionid': body['sessionid']}, function (e, docs) {
        if (docs.length > 0) {
            userschema.update({'username' : body['username']}, {$set : {'email' : body['email'], 'fullname' : body['fullname']}}, function(e, docs){
                if(!e){
                    res.send("");
                } else{
                    res.send("false");
                }

            });

        }
    });
});

/*
 * get the database categories and return to client.
 */
router.get('/databasecategories', function(req, res){
    var db = req.db;
    var wordcollection = db.get('words');

    wordcollection.find({},{},function(e,docs){
        var categories = [];
        console.log(docs);
        if(docs !== undefined) {
            for (var i = 0; i < docs.length; i++) {
                categories.push(docs[i]['category']['name']);
            }
        }
        res.json(categories);
    });
});

/*
 * post request to add a specified amount to a users score - can be used to update
 */
//TODO: change level based on point score!!
router.post('/addtoscore', function(req, res){
    var db = req.db;
    var collection = db.get('userlist');
    var body = req.body;

    collection.find({'username' : body['username']}, {}, function(e, docs){
        if(!e){
            var newscore = docs[0]['userscore'] + parseInt(body['amount']);
            var level;
            if(newscore < 50){
                level = 'New User';
            } else if(newscore < 200){
                level = 'Beginner';
            } else if(newscore < 500){
                level = 'Novice';
            } else if(newscore < 1000){
                level = 'Intermediate';
            } else if(newscore < 2000){
                level = 'Advanced';
            } else if(newscore < 5000){
                level = 'Expert';
            } else if(newscore < 10000){
                level = 'Professional';
            } else {
                level = 'Guru';
            }
            userschema.update({'username': body['username']}, {
                $set : {'userscore': newscore,
                'level': level}
            }, function (e, docs) {
                if (!e) {
                    userschema.update({'username': body['madeusername']}, {
                            $push: {
                                'scoresmade': {
                                    'username': body['username'],
                                    'score': body['amount']
                                }
                            }
                        },
                        function (e, docs) {
                            if (!e) {
                                res.send("");
                            } else {
                                res.send(e)
                            }
                        });
                } else {
                    res.send(e);
                }
            })
        } else {
            res.send(e);
        }
    });
});

/*
 * post request to check if a username exists in the database already (so user's cannot sign up with duplicate
 * usernames)
 */
router.post('/checkusername', function(req, res){
    var db = req.db;
    var collection = db.get('userlist');
    var body = req.body;
    collection.find({'username': body['username']}, {}, function(e,docs){
        console.log(docs);
        if(docs.length > 0){
            res.send(false);
        } else{
            res.send(true);
        }
    })
});

/*
 * post request to log a user in with a specified username and password. returns true if logged in and false if not.
 * todo: return different values if the user does not exist and if the password is wrong
 */
router.post('/loginuser', function(req, res){
    var db = req.db;
    var collection = db.get('userlist');
    var cookies = db.get('cookies');
    var body = req.body;

    collection.find({'username': body['username']}, {}, function(e, docs){
        if(docs.length > 0) {
            console.log('db: ' + docs[0]['password'] + ' and body: ' + body['password']);

            bcrypt.compare(body['password'], docs[0]['password']).then(function (result) {
                if (result) {
                    var session = randomstring.generate();
                    console.log(session);
                    cookies.update({'username' : body['username']}, {'username' : body['username'], 'sessionid' : session}, {upsert: true});
                    res.send(session);
                } else {
                    res.send('false');
                }
            });
        } else {
            res.send('false');
        }
    });
});

/*
 * delete to deleteuser.
 * todo: write properly
 */
router.post('/deleteuser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var cookies = db.get('cookies');
    var body = req.body;

    cookie.find({'username' : body['username'], 'sessionid' : body['sessionid']}, function(e, docs){
        if(docs.length > 0) {
            collection.remove({ 'username' : body['username'] }, function(e) {
                if(!e) {
                    cookies.remove({'username': body['username']}, function (e, docs) {
                        if(!e) {
                            res.send('');
                        } else{
                            res.send("false");
                        }
                    });
                } else{
                    res.send("false");
                }
            });
        } else{
            res.send("false");
        }
    });
});

router.post('/logoutuser', function(req, res){
    var body = req.body;
    cookie.remove({ 'username' : body['username'], 'sessionid' : body['sessionid']}, function(err){
        res.send((err === null) ? "true" : err);
    });
});

module.exports = router;
