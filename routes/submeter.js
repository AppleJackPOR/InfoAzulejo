var express = require('express');
var router = express.Router();
var infoAzulejoDAO = require("../models/infoAzulejoDAO");
var fs = require('fs');
const https = require('https');


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
    console.log("not bombado")
    uploadPhotos(req.body.azulejos);
    infoAzulejoDAO.inserirAzulejo(req.body, function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)

});

router.post("/sessoes", function(req, res, next) {
    console.log("eu choro");
    uploadPhotos(req.body.azulejos);
    infoAzulejoDAO.inserirAzulejo(req.body, function(err, result) {
        if (err) {
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(result.code).send(result.data);
    }, next)

});

module.exports = router;

function uploadPhotos(azulejos) {
    console.log("estou muito fotógrafo")
    var teste = []
    var body;
    for (const j in azulejos) {
        var filePathArray = [];
        for (var i in azulejos[j].nrImages) {
            console.log(azulejos[j].nrImages[i])
            const imageBuffer = new Buffer(azulejos[j].nrImages[i], "base64");
            const filePath = "./temporary_uploads/" + azulejos[j].id + "-" + i + ".jpg";
            filePathArray.push(filePath);
            console.log(filePathArray);
            try {
                fs.writeFileSync(filePath, imageBuffer);
            } catch (err) {
                console.log(err);
            }
        }
        for (const i in filePathArray) {
            console.log(filePathArray[i])

            fs.readFile(filePathArray[i], function(err, data) {
                if (err)
                    throw err;
                console.log(azulejos[j].id)
                var options = {
                    'method': 'PUT',
                    'hostname': 'storage.bunnycdn.com',
                    'path': '/azulejos/' + azulejos[j].id + '/' + i + '.jpg?AccessKey=81883e8b-c3e8-49c9-bec23323819a-4f45-4990',
                    'headers': {
                        'Content-Type': 'image/jpeg'
                    }
                };
                console.log(options.path)
                var reqBunny = https.request(options, function(resBunny) {
                    var chunks = [];

                    resBunny.on("data", function(chunk) {
                        chunks.push(chunk);
                    });
                    resBunny.on("end", function(chunk) {
                        body = Buffer.concat(chunks);
                        teste.push(body.toString());

                    });
                    resBunny.on("error", function(error) {
                        res.send(error);
                    });
                });
                reqBunny.write(data);
                reqBunny.end();
            });
        }
    }
}