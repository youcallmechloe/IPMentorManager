/*
 * Node.js file that uses express to deal with the group feautre. Adding, joining and posting in a group is dealt with
 */
var express = require('express');
var router = express.Router();
var Cookie = require('../models/cookies');
var Groups = require('../models/groups');

/*
 * want group JSON to look like: {'groupname' : '', 'description' : '', 'adim' : '', 'members' : ['', ''], 'posts' : ['', '']}
 * method to create a group from passed parameters
 */
router.post('/creategroup', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        if (docs.length > 0) {
            //check that group with passed groupname doesn't already exist
            Groups.find({'groupname': body['groupname']}, {}, function (e, docs) {

                if (docs.length > 0) {
                    res.send('false');
                } else {
                    var data = {
                        'groupname' : body['groupname'],
                        'description' : body['description'],
                        'admin' : body['username'],
                        'members' : body['members'],
                        'posts' : []
                    };
                    collection.insert(data, function (err, result) {
                        res.send((err === null) ? '' : {msg: 'error: ' + err});
                    })
                }
            });
        } else{
            res.send("not allowed");
        }
    });
});

/*
 * Want post JSON to look like: {'username' : '', 'groupname' : ''}
 * method to add a user to a group
 */
router.post('/joingroup', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        if (docs.length > 0) {
            collection.update({'groupname': body['groupname']}, {$addToSet: {'members': body['username']}});
        }
    });

    res.send({msg: ''});
});

//method to allow a user to leave a group
router.post('/leavegroup', function(req, res){
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        if (docs.length > 0) {
            Groups.update({'groupname' : body['groupname']}, {$pull : {'members' : body['username']}}, function(e, docs){
                res.send({msg: ''});
            });
        }

    });

});

//method to add a user to a group
router.post('/groupmember', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    collection.find({'groupname' : body['groupname'], 'members': {$in : [body['username']]}}, {}, function(e, docs){
        if(docs === undefined){
            res.send('true');
        } else{
            res.send('false');
        }
    });
});

/*
 * Want post JSON to look like: {'username' : '', 'groupname' : '', 'post' : ''}
 * method to post into a group with date and time
 */
router.post('/postingroup', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        var time = new Date().toTimeString();
        var cuttime = time.substring(0, 8);
        var date = new Date().toDateString();
        if (docs.length > 0) {
            Groups.findOneAndUpdate({'groupname': body['groupname']},
                {$push: {'posts': {$each: [{'post': body['post'], 'username': body['username'], 'time' : cuttime, 'date': date, 'replies' : []}], $position: 0}}},
            {new: true}, function(err, doc){
                res.send(doc);
            });
        }
    });
});

//returns groups with partial name as parameter passed
router.get('/getgroups/:id', function (req, res) {
    var db = req.db;
    var groupCollection = db.get('groups');
    var body = req.params['id'];

    Groups.find({'groupname': {'$regex' : body}}, {}, function (e, docs) {
        var categories = [];
        for (var i = 0; i < docs.length; i++) {
            categories.push(docs[i]['groupname']);
        }
        res.send(categories);
    });
});

//returns group description of group passed as parameter
router.get('/getdescription/:id', function(req, res){
    var db = req.db;
    var groupCollection = db.get('groups');
    var body = req.params['id'];

    groupCollection.find({'groupname' : body}, {}, function(e, docs){
        if(docs !== undefined) {
            res.send(docs[0]['description']);
        } else{
            res.send('');
        }
    });
});

//method to return groups that a user is a member of
router.post('/groupsmemberof', function(req, res){
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs){
        if(docs.length > 0) {
            //finds all groups that user is member of from db
            Groups.find({'members': {$in: [body['username']]}}, {}, function (e, docs) {
                var names = [];

                for (var i = 0; i < docs.length; i++) {
                    names.push(docs[i]);
                }
                res.send(names);
            });
        } else{
            res.send([]);
        }
    });
});

//method to return groups that a user owns
router.post('/groupsown', function(req, res){
    var body = req.body;

    //check cookies to confirm request coming from user
    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs){
        if(docs.length > 0) {
            //finds all groups that a user is an admin of
            Groups.find({'admin': body['username']}, {}, function (e, docs) {
                var names = [];

                for (var i = 0; i < docs.length; i++) {
                    names.push(docs[i]);
                }
                res.send(names);
            });
        } else{
            res.send([]);
        }
    });
});

module.exports = router;
