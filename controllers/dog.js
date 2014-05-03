'use strict';

var fs = require('fs');
var async = require('async');

var mongoose = require('mongoose');
var Dog = mongoose.model('Dog');
var Image = mongoose.model('Image');

module.exports.get = function (req, res) {
  var id = req.user.id;

  Dog.find({userId: id}, function (err, dogs) {
    if (err) throw err;

    async.map(dogs, function (dog, cb) {
      var dogObject = dog.toObject();

      if (dog.imageId !== '') {
        Image.findById(dog.imageId, function (err, image) {
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
      res.send(dogs);
    });

  });
};

module.exports.add = function (req, res) {
  var file = req.files.image;
  if (file) {
    fs.readFile(file.path, function(err, data) {
      if (err) throw err;

      var image = new Image({
        name: file.name,
        type: file.type,
        content: data,
        userId: req.user.id
      });

      image.save(function (err, image) {
        if (err) throw err;

        create(req, image._id.toString(), function () {
          res.send(200);
        });
      });

      fs.unlink(file.path, function (err) {
        if (err) throw err;
      });
    });

  } else {
    create(req, function () {
      res.send(200);
    });
  }
};

function create(req, imageId, cb) {
  if ("function" == typeof imageId) {
    cb = imageId;
    imageId = null;
  }

  var dog = new Dog({
    imageId: imageId || '',
    userId: req.user.id,
    name: req.body.name,
    fullname: req.body.fullname,
    breed: req.body.breed,
    breeder: req.body.breeder
  });

  dog.save(function (err) {
    if (err) throw err;
    cb();
  });
}
