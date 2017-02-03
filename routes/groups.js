/*
 * Node.js file that uses express to deal with the group feautre. Adding, joining and posting in a group is dealt with
 */
var express = require('express');
var router = express.Router();

//TODO: on front end!!! do the group name thingy so user gets told straight away of a taken group name!
/*
 * want group JSON to look like: {'groupname' : '', 'description' : '', 'members' : ['', ''], 'posts' : ['', '']}
 */
router.post('/creategroup', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    collection.find({'username': body['username']}, {}, function(e, docs) {

        if (docs.length > 0) {
            res.send('false');
        } else {
            collection.insert(body, function (err, result) {
                res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
            })
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

    collection.update({'groupname' : body['groupname']}, {$addToSet : {'members': body['username']}});

    res.send({msg: ''});
});

//TODO: again check, could add timestamps to posts? could use $currentDate to set a timestamp
/*
 * Want post JSON to look like: {'username' : '', 'groupname' : '', 'post' : ''}
 */
router.post('/postingroup', function(req, res){
    var db = req.db;
    var collection = db.get('groups');
    var body = req.body;

    collection.update({'groupname' : body['groupname']},
        {$push : {'posts': {'post' : body['post'], 'username' : body['username']}}});

    res.send({msg: ''});
});


module.exports = router;
