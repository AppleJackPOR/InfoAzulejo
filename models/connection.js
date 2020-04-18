var MongoClient = require('mongodb').MongoClient;


// Connection URL
const url = 'mongodb+srv://hugo-varela:TtoUiHwgFa4H3hju@azulejos-7d4bn.mongodb.net/test?authSource=admin&replicaSet=Azulejos-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

MongoClient.connect(url, function(err, client) {
    if (err) throw err;
    console.log('Connected to MongoDB');

});


module.exports.url = url;