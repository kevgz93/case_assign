var MongoClient = require('mongodb').MongoClient;
//nombre de la base q se habia creado
var dburl = 'mongodb://localhost:27017/queue';

var _connection = null;

var open = function() {
  MongoClient.connect(dburl, function(err, db) {
    if (err) {
      console.log("DB connection failed");
      return;
    }
    _connection = db;
    console.log("DB connection open");
  });
};

var get = function() {
  return _connection;
};

module.exports = {
  open : open,
  get : get
};
