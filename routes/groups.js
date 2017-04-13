/*
 * Node.js file that uses express to deal with the group feautre. Adding, joining and posting in a group is dealt with
 */
var express = require('express');
var router = express.Router();
var Cookie = require('../models/cookies');
var Groups = require('../models/groups');

//TODO: on front end!!! do the group name thingy so user gets told straight away of a taken group name!
/*
 * want group JSON to look like: {'groupname' : '', 'description' : '', 'adim' : '', 'members' : ['', ''], 'posts' : ['', '']}
 */
router.post('/creategroup', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        if (docs.length > 0) {
            Groups.find({'groupname': body['groupname']}, {}, function (e, docs) {

                console.log(docs);

                if (docs.length > 0) {
                    res.send('false');
                } else {
                    var data = {
                        'groupname' : body['groupname'],
                        'desription' : body['description'],
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

//TODO: make sure actually works, check arrangement of req body?
/*
 * Want post JSON to look like: {'username' : '', 'groupname' : ''}
 */
router.post('/joingroup', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    Cookie.find({'username' : body['username'], 'sessionID' : body['sessionID']}, function(e, docs) {
        console.log(docs);
        if (docs.length > 0) {
            collection.update({'groupname': body['groupname']}, {$addToSet: {'members': body['username']}});
        }
    });

    res.send({msg: ''});
});

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

//TODO: again check, could add timestamps to posts? could use $currentDate to set a timestamp
/*
 * Want post JSON to look like: {'username' : '', 'groupname' : '', 'post' : ''}
 */
router.post('/postingroup', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs) {
        var time = new Date().toTimeString();
        var cuttime = time.substring(0, 8);
        var date = new Date().toDateString();
        console.log(date + time);
        if (docs.length > 0) {
            Groups.findOneAndUpdate({'groupname': body['groupname']},
                {$push: {'posts': {$each: [{'post': body['post'], 'username': body['username'], 'time' : cuttime, 'date': date, 'replies' : []}], $position: 0}}},
            {new: true}, function(err, doc){
                res.send(doc);
            });
        }
    });
});

router.get('/getgroups/:id', function (req, res) {
    var db = req.db;
    var groupCollection = db.get('groups');
    var body = req.params['id'];

    groupCollection.find({'groupname': {'$regex' : body}}, {}, function (e, docs) {
        var categories = [];
        for (var i = 0; i < docs.length; i++) {
            categories.push(docs[i]['groupname']);
        }
        res.json(categories);
    });
});

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

router.post('/groupsmemberof', function(req, res){
    var body = req.body;

    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs){
        console.log(docs);
        if(docs.length > 0) {
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

router.post('/groupsown', function(req, res){
    var body = req.body;

    Cookie.find({'username' : body['username'], 'sessionid' : body['sessionID']}, function(e, docs){
        console.log(docs);
        if(docs.length > 0) {
            Groups.find({'admin': body['username']}, {}, function (e, docs) {
                var names = [];

                for (var i = 0; i < docs.length; i++) {
                    names.push(docs[i]);
                }
                console.log(names);
                res.send(names);
            });
        } else{
            res.send([]);
        }
    });
});

module.exports = router;
