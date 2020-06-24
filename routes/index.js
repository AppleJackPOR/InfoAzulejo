var express = require('express');
var router = express.Router();
var InfoAzulejoDAO = require("../models/infoAzulejoDAO");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'InfoAzulejo' });
});

router.get('/azulejo', function(req, res, next) {
    res.render('azulejo', { title: 'InfoAzulejo' });
});

router.get('/equipa', function(req, res, next) {
    res.render('equipa', { title: 'InfoAzulejo' });
});

router.get('/submeter', function(req, res, next) {
    res.render('submeter', { title: 'InfoAzulejo' });
});

router.get('/avaliar', function(req, res, next) {
    res.render('avaliar', { title: 'InfoAzulejo' });
});


module.exports = router;
