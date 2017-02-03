/*
 * Node.js file that deals with general backend stuff. For now simply renders the HTML and fetches database categories
 * for use on the front end
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Mentor Manager' });
});

module.exports = router;

