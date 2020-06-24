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

router.get('/azulejo', function(req, res, next) {
    infoAzulejoDAO.getAzulejo(function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)
});

router.get('/like/:id', function(req, res, next) {
    infoAzulejoDAO.getAzulejoLike(req.params.id,function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)
});

router.get('/azulejoDist', function(req, res, next) {
    infoAzulejoDAO.getAzulejoDist(function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)
});



router.get("/:id", function(req, res, next) {
    var id = req.params.id;
    infoAzulejoDAO.getAzulejoEspecifico(id, function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)
});

router.post("/avaliar", function(req, res, next) {
    console.log("boas");
    infoAzulejoDAO.updateAzulejo(req.body, function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)

});

module.exports = router;
/*
router.get('/', function(req, res, next) {
    mongo.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, function(err, client) {
        if (err) throw err;

        var db = client.db('app_azulejos');
        db.collection('azulejos_info').find({}).toArray(function(findErr, docs) {
            if (findErr) throw findErr;
            console.log(JSON.stringify(docs));
            client.close();
            res.send({ docs })
        });
    })
});

router.post('/', function(req, res, next) {
    mongo.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, function(err, client) {
        if (err) throw err;

        var db = client.db('app_azulejos');
        db.collection('azulejos_info').find({
            "Localizacao": {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [req.body.lng, req.body.lat]
                    },
                    "$minDistance": 0,
                    "$maxDistance": 5000
                }
            }
        }, { "Info": 0, "Ano": 0, "Condicao": 0 }).toArray(function(findErr, docs) { //Not working
            if (findErr) throw findErr;
            console.log(JSON.stringify(docs));
            client.close();
            res.send({ docs })
        });
    })
})

router.get('/:id', function(req, res, next) {
    mongo.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, function(err, client) {
        if (err) throw err;
        var marker = new ObjectId(req.params.id)
        var db = client.db('app_azulejos');

        db.collection("azulejos_info").findOne({ "_id": marker }, function(findErr, doc) {
            if (findErr) throw findErr;
            client.close();
            res.send(doc);
        })
    })
})
*/