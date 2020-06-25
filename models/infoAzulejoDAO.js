var express = require('express');
var router = express.Router();
var url = require('./connection').url;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const https = require('https');

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

module.exports.validarUser = function(utilizador, callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;
        var dbA = client.db('app_azulejos');
        var obj = {
            'username': utilizador.nome,
            'password': utilizador.password
        };
        dbA.collection('azulejos_user', function(err, collection) {
            if (err)
                throw err;
            collection.find(obj).toArray(function(err, results) {
                console.log(results);
                if (results.length == 0) {
                    callback(err, { code: 500, status: "Error in a database query" })
                    return;
                } else
                    callback(false, { code: 200, status: "ok", data: results })
            });
        });
    });
}

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

module.exports.getAzulejoLike = function(val, callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;
        var dbA = client.db('app_azulejos');
        dbA.collection('azulejos_info', function(err, collection) {
            if (err)
                throw err;
            collection.find({ Nome: new RegExp(val, 'i') }).toArray(function(err, results) {
                console.log(results);
                callback(false, { code: 200, status: "ok", data: results })
            });
        })
    })
}

module.exports.getAzulejoDist = function(callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;
        var dbA = client.db('app_azulejos');
        dbA.collection('azulejos_info').aggregate([{
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                },
                "distanceField": "distance",
                "spherical": true,
            }
        }]).toArray(function(err, items) {
            res.send(items);
            client.close();
        });;
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
            collection.findOne({ _id: new ObjectId(id) }, function(err, results) {
                console.log(results);
                https.get('https://storage.bunnycdn.com/azulejos/' + id + '/?AccessKey=81883e8b-c3e8-49c9-bec23323819a-4f45-4990', (response) => {
                    console.log('statusCode:', response.statusCode);
                    response.on('data', (d) => {
                        var json = JSON.parse(d.toString()).length
                        results['nrImages'] = json;
                        callback(false, { code: 200, status: "ok", data: results })
                    });
                }).on('error', (e) => {
                    console.error(e);
                });
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
                    console.log(results);
                    callback(false, { code: 200, status: "ok", data: results })

                });
            })
        })
    }
    /*
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
    */

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

module.exports.inserirImagem = function(callback, next) {
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;
        var dbA = client.db('app_azulejos');
        dbA.collection("azulejos_info").insertOne(document, function(findErr, doc) {
            if (findErr) throw findErr;
            client.close();
            for (const i in filePathArray) {
                console.log(filePathArray[i])
                fs.readFile(filePathArray[i], function(err, data) {
                    if (err) throw err;
                    console.log(filePathArray[i])
                    var options = {
                        'method': 'PUT',
                        'hostname': 'storage.bunnycdn.com',
                        'path': '/azulejos/' + doc.insertedId + '/' + i + '.jpg?AccessKey= 81883e8b-c3e8-49c9-bec23323819a-4f45-4990',
                        'headers': {
                            'Content-Type': 'image/jpeg'
                        }
                    };
                    var reqBunny = https.request(options, function(resBunny) {
                        var chunks = [];

                        resBunny.on("data", function(chunk) { chunks.push(chunk); });
                        resBunny.on("end", function(chunk) {
                            body = Buffer.concat(chunks);
                            teste.push(body.toString());
                        });
                        resBunny.on("error", function(error) { res.send(error); });
                    });
                    reqBunny.write(data);
                    reqBunny.end();
                });
            }
            res.send('done');
        })
    })
}


module.exports.updateAzulejo = function(azulejo, callback, next) {
    console.log(azulejo);
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;
        var dbA = client.db('app_azulejos');
        dbA.collection('azulejos_info', function(err, collection) {
            if (err)
                throw err;
            collection.update({ _id: new ObjectId(azulejo.id) }, { $set: { Nome: azulejo.nome, Ano: azulejo.ano, Info: azulejo.descricao, Condicao: azulejo.condicao, Estado: azulejo.estado } }, (function(err, results) {
                console.log(results);
                callback(false, { code: 200, status: "ok", data: results })

            }));
        })
    })
}

module.exports.inserirAzulejo = function(azulejo, callback, next) {
    console.log("bombadinho");
    var sessionID = new ObjectId(req.body.sessao.id);
    var userID = new ObjectId(req.body.sessao.idAutor);
    MongoClient.connect(url, function(err, client) {
        if (err)
            throw err;
        var dbA = client.db('app_azulejos');
        console.log("estou quase");
        dbA.collection("azulejos_sessoes").insertOne({
            "_id": sessionID,
            "data": new Date().toISOString(),
            "estado": azulejo.sessao.state,
            "info": azulejo.sessao.name,
            "idAutor": userID,
            "azulejos": azulejo.sessao.tiles
        }, function(findErr, doc) {
            console.log("estou mais perto")
            if (findErr)
                throw findErr;
            var documents = [];
            for (var i in azulejo.azulejos) {
                var azulejo = azulejo.azulejos[i];
                var document = {
                    "_id": new ObjectId(azulejo.id),
                    "Nome": azulejo.name,
                    "Ano": azulejo.year,
                    "Info": azulejo.info,
                    "Condicao": azulejo.condition,
                    "Sessao": sessionID,
                    "Localizacao": {
                        "type": "Point",
                        "coordinates": azulejo.location
                    }
                }
                documents.push(document);
            }
            db.collection("azulejos_info").insertMany(documents, function(findErr, doc) {
                console.log("obviamente que não cheguei até aqui");
                if (findErr)
                    throw findErr;
                console.log(doc)
                client.close();
            });
        })
        res.status(200).json({ content: 'done' });
    })
}