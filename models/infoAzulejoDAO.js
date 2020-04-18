var express = require('express');
var router = express.Router();
var url = require('./connection').url;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


//var mongoDAO = require('../models/azulejosDAO');


/*
module.exports.getAzulejo = function() {
    mongoC.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, function(err, client) {
        if (err) throw err;

        var db = client.db('app_azulejos');
        db.collection('azulejos_info').find({
            "Localizacao": {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [req.body.long, req.body.lat]
                    },
                    "$minDistance": 0,
                    "$maxDistance": 50000000000
                }
            }
        });
    })
}
*/


module.exports.getAzulejo = function(callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;

        var dbA = client.db('app_azulejos');
        dbA.collection('azulejos_info', function(err, collection) {
            if (err)
                throw err;

            collection.find().toArray(function(err, results) {

                callback(false, { code: 200, status: "ok", data: results })

            });
        })
    })
}


module.exports.getAzulejoEspecifico = function(id, callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;

        var dbA = client.db('app_azulejos');
        dbA.collection('azulejos_info', function(err, collection) {
            if (err)
                throw err;
            console.log(collection);
            collection.find({ _id: new ObjectId(id) }).toArray(function(err, results) {
                console.log(results);
                callback(false, { code: 200, status: "ok", data: results })

            });
        })
    })
}


module.exports.getCondicao = function(callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;

        var dbA = client.db('app_azulejos');
        dbA.collection('azulejos_condicao', function(err, collection) {
            if (err)
                throw err;

            collection.find().toArray(function(err, results) {
                callback(false, { code: 200, status: "ok", data: results })
            });
        })
    })
}

module.exports.getUser = function(callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;

        var dbA = client.db('app_azulejos');
        dbA.collection('azulejos_user', function(err, collection) {
            if (err)
                throw err;

            collection.find().toArray(function(err, results) {
                callback(false, { code: 200, status: "ok", data: results })

            });
        })
    })
}

module.exports.inserirAzulejo = function(azulejo, callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;
        var dbA = client.db('app_azulejos');
        var obj = {
            Nome: azulejo.Nome,
            Ano: azulejo.Ano,
            Info: azulejo.Info,
            Condicao: azulejo.Condicao,
            Localizacao: { coordinates: { 0: azulejo.lat, 1: azulejo.long } }
        };
        dbA.collection('azulejos_info', function(err, collection) {
            if (err)
                throw err;

            collection.insertOne({
                obj,
                function(err, res) {
                    if (err) throw err;
                    console.log("Objeto inserido: " + obj);
                    dbA.close();
                }
            });
        });
    });
}

module.exports.getSessao = function(callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;

        var dbA = client.db('app_azulejos');
        dbA.collection('azulejos_sessoes', function(err, collection) {
            if (err)
                throw err;

            collection.find().toArray(function(err, results) {
                callback(false, { code: 200, status: "ok", data: results })

            });
        })
    })
}

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