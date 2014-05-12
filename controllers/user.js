'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Dog = mongoose.model('Dog');
var Image = mongoose.model('Image');
var async = require('async');
var bcrypt = require('bcrypt');

module.exports.get = function (req, res) {

  Dog.find({userId: req.user.id}, function (err, dogs) {
    if (err) throw err;

    async.map(dogs, function (dog, cb) {
      var dogObject = dog.toObject();

      if (dog.imageId !== '') {

        Image.findById(dog.imageId, function (err, image) {
          if (err) throw err;
          var img = image.toObject();
          dogObject.image = img.content;
          cb(err, dogObject);
        });

      } else {
        cb(null, dogObject);
      }
    },

    function (err, dogs) {
      if (err) throw err;
      res.send({
        dogs: dogs,
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.username
      });
    });

  });
};

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
