/**
 * Created by root on 15/02/2017.
 */

var express = require('express');
var router = express.Router();

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
                words.push(dbWord.toLowerCase());
            }
        }

        res.send(words);
    });
});

router.post('/createworkpartner', function(req, res){

});

//TODO: actually write properly
router.get('/matching', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');

    var body = req.query;
    var word = body.word;
    var category = body.category;

    if((word !== null) && (category !== null)){
        request('http://api.datamuse.com/words?ml=' + word, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var body = JSON.parse(body).slice(0, 19);
                var wordsList = [];
                for(var i = 0; i < body.length; i++){
                    var object = body[i];
                    wordsList.push(object['word']);
                }
            }
        })

    }
    res.status(400);
    res.send();

});
module.exports = router;
