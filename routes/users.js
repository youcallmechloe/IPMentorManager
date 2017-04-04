/*
 * Node.js file to deal with the user section of the backend, uses express to add, login, delete and update users as well as
 * checking usernames for new users.
 * Also contains the matching algorithm FOR NOW
 * TODO: move matching algorithm to it's own file!! probs
 */

var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var randomstring = require('randomstring');
var UserSchema = require('../models/users');
var WordSchema = require('../models/words');
var Cookie = require('../models/cookies');

/*
 * GET userlist and returns in JSON to client
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to adduser. Currently adds user's information and specified knowledge words to relevant databases
 * Hashes the password with a random salt which can be easily compared with the string password.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var cookies = db.get('cookies');
    var body = req.body;
    var error = '';


    const saltRounds = 10;
    const myPlaintextPassword = body['password'];
    var knowledge = [];
    if(body['knowledge'].length > 0){
        knowledge = JSON.parse(body['knowledge']);
    }
    var userKnowledge = [];

    if (knowledge.length > 0) {
        for (var i = 0; i < knowledge.length; i++) {
            var obj = {'word': knowledge[i].word, 'category': knowledge[i].category};
            userKnowledge.push(obj);
        }
    }

    bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
        console.log(body['username']);
        var userInfo = {
            'username': body['username'],
            'email': body['email'],
            'password': hash,
            'fullname': body['fullname'],
            'age': body['age'],
            'gender': body['gender'],
            'degree': body['degree'],
            'userscore' : 0,
            'knowledge': userKnowledge,
            'workpartners' : []
        };
        //TODO: why am i checking this twice???
        collection.find({'username': body['username']}, {}, function (e, docs) {
            if (docs.length > 0) {
                res.send('false');
                return;
            } else {
                collection.insert(userInfo, function (err, result) {
                    error = err;
                });

                var session = randomstring.generate();
                cookies.update({'username' : body['username']}, {'username' : body['username'], 'sessionID' : session}, {upsert: true});

                var wordCollection = db.get('words');
                console.log(knowledge);

                if (knowledge.length !== undefined) {
                    for (var i = 0; i < knowledge.length; i++) {
                        wordCollection.update({'word': knowledge[i]['word'], 'category': knowledge[i]['category']},
                            {$push: {'users': body['username']}}, {upsert: true});
                    }
                }

                res.send((error !== null) ? session : error);
            }
        });

    });

});

var addMultiUsers = function(){
    var choosing = Math.random();

};

router.post('/userinfo', function(req, res){
    var db = req.db;
    var userCollection = db.get('userlist');
    var body = req.body;
    console.log(body);
    var userInfo = [];

    Cookie.find({'username' : body['username'], 'sessionID' : body['sessionID']}, function(e, docs){
        if(docs.length > 0){
            userCollection.find({'username' : body['username']}, {}, function(e, docs){
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
                        'knowledge' : docs[0]['knowledge']
                    };
                    userInfo.push(user);
                    console.log(user);
                }

                res.send(user);
            });
        } else{
            res.send("false");
        }
    });

});

/*
 * Get the database categories and return to client.
 */
router.get('/databaseCategories', function(req, res){
    var db = req.db;
    var wordCollection = db.get('words');

    wordCollection.find({},{},function(e,docs){
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
router.post('/addtoscore', function(req, res){
    var db = req.db;
    var collection = db.get('userlist');
    var body = req.body;
    console.log(body['amount']);

    collection.update({'username': body['username']}, {$inc : {'userscore' : body['amount']}}, function(e, docs){
        if(docs !== undefined) {
            console.log(docs);
            res.send(String(docs["nModified"]));
        } else{
            res.send("");
        }
    });

});

/*
 * Post request to check if a username exists in the database already (so user's cannot sign up with duplicate
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
 * Post request to log a user in with a specified username and password. Returns true if logged in and false if not.
 * TODO: return different values if the user does not exist and if the password is wrong
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
                    cookies.update({'username' : body['username']}, {'username' : body['username'], 'sessionID' : session}, {upsert: true});
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
 * DELETE to deleteuser.
 * TODO: write properly
 */
router.post('/deleteuser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var cookies = db.get('cookies');
    var body = req.body;

    Cookie.find({'username' : body['username'], 'sessionID' : body['sessionID']}, function(e, docs){
        if(docs.length > 0) {
            collection.remove({ 'username' : body['username'] }, function(err) {
                res.send((err === null) ? '' : { msg:'error: ' + err });
            });
        } else{
            res.send("false");
        }
    });
});

router.post('/logoutuser', function(req, res){
    var body = req.body;
    Cookie.remove({ 'username' : body['username'], 'sessionID' : body['sessionID']}, function(err){
        res.send((err === null) ? "true" : err);
    });

    // Cookie.find({ 'username' : body['username'], 'sessionID' : body['sessionID']}).remove( function(err){
    //
    // });
});

module.exports = router;
