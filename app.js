var express = require('express');
var passport = require('passport');
var fs = require('fs');
var mongoose = require('mongoose');
var config = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

// Initialize mongo models
var modelsPath = __dirname + '/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = module.exports = express();

var auth = require('./config/auth')(passport);
require('./config/express')(app, config, passport);
require('./config/routes')(app, auth);

app.listen(config.port);
console.log('Server started at ' + config.port);