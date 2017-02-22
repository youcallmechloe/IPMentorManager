/**
 * Created by root on 15/02/2017.
 */

var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

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
router.post('/matching', function(req, res) {
    var db = req.db;
    var userCollection = db.get('userlist');
    var wordColletion = db.get('words');
    var masterlist = db.get('masterlist');
    var body = req.body;
    var interests = body['interests'];
    var userGet = [];


    userCollection.find({'age': {$lte: body['age']}}, {}, function (e, docs) {
        for(var i = 0; i < docs.length; i++){
            if(body['gender'] === 'none'){
                var user = {
                    'username' : docs[i]['username'],
                    'email' : docs[i]['email'],
                    'fullname' : docs[i]['fullname'],
                    'age' : docs[i]['age'],
                    'gender' : docs[i]['gender'],
                    'degree' : docs[i]['degree'],
                    'knowledge' : docs[i]['knowledge']
                };
            } else{
                if(docs[i]['gender'] === body['gender']){
                    var user = {
                        'username' : docs[i]['username'],
                        'email' : docs[i]['email'],
                        'fullname' : docs[i]['fullname'],
                        'age' : docs[i]['age'],
                        'gender' : docs[i]['gender'],
                        'degree' : docs[i]['degree'],
                        'knowledge' : docs[i]['knowledge']
                    };
                }
            }
            userGet.push(user);
        }
    });

    //if statement doesnt work properly yet, some reason method doesnt actually return a bool
    var wordUsers = [];
    for(var i = 0; i < interests.length; i++) {
        var bool = false;
        masterlist.find({'words': interests[i]['word']}, function(e, docs) {
            if (docs.length > 0) {
                bool=true;
            }
        });
        console.log(bool);
        if(bool) {
            wordUsers = getWordUsers(wordColletion, interests[i]['word'], interests[i]['category']);
        } else{
            var similar = getSimilarWords(interests[i]['word']);
            for(var i = 0; i < similar.length; i++){
                if(existsInDB(masterlist, similar[i])){
                    wordUsers = getWordUsers(wordColletion, similar[i], interests[i]['category']);
                }
            }
        }
    }

    res.send(userGet);

});

var existsInDB = function(masterlist, word){
    var bool = false;
    masterlist.find({'words': word}, function(e, docs){
        if(docs.length > 0){
            bool = true;
            console.log(word + bool);
        }
        return bool;
    });
};

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

    return wordsList;
};

var getWordUsers = function(wordCollection, word, category){
    wordCollection.find({'category.name' : category, 'category.words.name' : word}, function(e, docs){
        console.log(docs);
    });
};

module.exports = router;
