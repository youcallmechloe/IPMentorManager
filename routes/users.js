/*
 * Node.js file to deal with the user section of the backend, uses express to add, login, delete and update users as well as
 * checking usernames for new users.
 * Also contains the matching algorithm FOR NOW
 * TODO: move matching algorithm to it's own file!! probs
 */

var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

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
    var masterCollection = db.get('masterlist');
    var body = req.body;
    var error = '';

    collection.find({'username': body['username']}, {}, function(e, docs) {

        if(docs.length > 0){
            res.send('false');
        } else {

            const saltRounds = 10;
            const myPlaintextPassword = body['password'];
            var knowledge = JSON.parse(body['knowledge']);


            var userKnowledge = [];

            if (knowledge.length > 0) {
                for (var i = 0; i < knowledge.length; i++) {
                    var obj = {'word' : knowledge[i].word, 'category' : knowledge[i].category};
                    userKnowledge.push(obj);
                }
            }

            bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
                var userInfo = {
                    'username': body['username'],
                    'email': body['email'],
                    'password': hash,
                    'fullname': body['fullname'],
                    'age': body['age'],
                    'gender': body['gender'],
                    'degree': body['degree'],
                    'knowledge' : userKnowledge
                };
                //TODO: why am i checking this twice???
                collection.find({'username': body['username']}, {}, function (e, docs) {
                    if (docs.length > 0) {
                        res.send(e);
                        return;
                    } else {
                        collection.insert(userInfo, function (err, result) {
                            error = err;
                        });
                    }
                });

            });

            var wordCollection = db.get('words');
            console.log(knowledge);

            if (knowledge.length > 0) {
                for (var i = 0; i < knowledge.length; i++) {
                    //updating the words within the database if a user has not used it before
                    wordCollection.update(
                        {'category.name': {$in: [knowledge[i].category]}},
                        {$addToSet: {'category.words': {'name': knowledge[i].word}}},
                        {upsert: true}
                    );

                    //updating the users within a word if the user has the word listed
                    wordCollection.update(
                        {
                            'category.name': {$in: [knowledge[i].category]},
                            'category.words': {$elemMatch: {'name': knowledge[i].word}}
                        },
                        {$push: {'category.words.$.users': body['username']}},
                        {upsert: true}
                    );

                    masterCollection.update({ _id: 1 }, {$addToSet : {'words' : knowledge[i].word}}, {upsert: true});
                }
            }
            res.send((error !== null) ? 'true' : error);
        }
    });

});

router.post('/userinfo', function(req, res){
    var db = req.db;
    var userCollection = db.get('userlist');
    var wordCollection = db.get('words');
    var body = req.body;
    var userInfo = [];

    userCollection.find({'username' : body['username']}, {}, function(e, docs){
        if(docs.length > 0) {
            var user = {
                'username' : docs[0]['username'],
                'email' : docs[0]['email'],
                'fullname' : docs[0]['fullname'],
                'age' : docs[0]['age'],
                'gender' : docs[0]['gender'],
                'degree' : docs[0]['degree'],
                'knowledge' : docs[0]['knowledge']
            };
            userInfo.push(user);
        }

        res.send(user);
    });

    wordCollection.find({'users' : {$in : [body['username']]}}, {}, function(e, docs){
       console.log(docs);
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
    var body = req.body;

    collection.find({'username': body['username']}, {}, function(e, docs){
        if(docs.length > 0) {
            console.log('db: ' + docs[0]['password'] + ' and body: ' + body['password']);

            bcrypt.compare(body['password'], docs[0]['password']).then(function (result) {
                if (result) {
                    res.send('true');
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
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
