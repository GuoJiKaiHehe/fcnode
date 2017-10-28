

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on("open",function(){
	console.log('open db');
})
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});
db.on("success",function(){
	console.log("connecte success mongodb");
})

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model); //引入所有model;
});
var app = express();

module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

