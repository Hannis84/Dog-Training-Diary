'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt');

module.exports.signup = function (req, res) {
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) throw err;
    var user = new User({ username: req.body.username, password: hash, firstName: req.body.firstName, lastName: req.body.lastName });
    user.save(function (err) {
      if (err) throw err;
      req.login(user, function (err) {
        if (err) throw (err);
        res.send(200);
      });
    });
  });
};