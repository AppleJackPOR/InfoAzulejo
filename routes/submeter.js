var express = require('express');
var router = express.Router();
var infoAzulejoDAO = require("../models/infoAzulejoDAO");



router.get('/', function(req, res, next) {
    infoAzulejoDAO.getCondicao(function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);

    }, next)
});

router.post("/inserirAzulejo", function(req, res, next) {

    smartshopDAO.inserirAzulejo(req.body, function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)

});


module.exports = router;