var express = require('express');
var router = express.Router();
var infoAzulejoDAO = require("../models/infoAzulejoDAO");

router.post("/login", function(req, res, next) {
    infoAzulejoDAO.validarUser(req.body, function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            console.log(req.body);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)

});
module.exports = router;