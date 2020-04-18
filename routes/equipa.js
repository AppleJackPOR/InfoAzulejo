var express = require('express');
var router = express.Router();
var infoAzulejoDAO = require("../models/infoAzulejoDAO");

router.get('/', function(req, res, next) {
    infoAzulejoDAO.getAzulejo(function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);

    }, next)
});


router.get("/azulejo", function(req, res, next) {
    var nome = req.params.Nome;
    infoAzulejoDAO.getAzulejo(id, function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)
});

module.exports = router;