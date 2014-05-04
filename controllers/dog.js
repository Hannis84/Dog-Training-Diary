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

module.exports.getById = function (req, res) {
  var id = req.params.id;

  Dog.findById(id, function (err, dog) {
    if (err) throw err;

    if (dog.imageId !== '') {
      var dogObject = dog.toObject();

      Image.findById(dog.imageId, function (err, image) {
          var img = image.toObject();
          dogObject.image = img.content;
          res.send(dogObject);
      });

    } else {
      res.send(dog);
    }
  });
};

module.exports.add = function (req, res) {
  var file = req.files.image;
  if (file) {
    createImage(file, req.user.id, function (imageId) {
      create(req, imageId, function () {
        res.send(200);
      });
    })

  } else {
    create(req, function () {
      res.send(200);
    });
  }
};

module.exports.edit = function (req, res) {
  var id = req.params.id;
  var file = req.files.image;
  if (file) {
    createImage(file, req.user.id, function (imageId) {
      update(id, req, imageId, function () {
        res.send(200);
      });
    })

  } else {
    update(id, req, function () {
      res.send(200);
    });
  }
};

function createImage(file, userId, cb) {
  fs.readFile(file.path, function(err, data) {
    if (err) throw err;

    var image = new Image({
      name: file.name,
      type: file.type,
      content: data,
      userId: userId
    });

    image.save(function (err, image) {
      if (err) throw err;

      cb(image._id.toString());
    });

    fs.unlink(file.path, function (err) {
      if (err) throw err;
    });
  });
}

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
    breeder: req.body.breeder,
    sports: [].concat(req.body.sports)
  });

  dog.save(function (err) {
    if (err) throw err;
    cb();
  });
}

function update(id, req, imageId, cb) {
  if ("function" == typeof imageId) {
    cb = imageId;
    imageId = null;
  }

  Dog.findById(id, function (err, dog) {
    if (imageId) dog.imageId = imageId;
    dog.name = req.body.name;
    dog.fullname = req.body.fullname;
    dog.breed = req.body.breed;
    dog.breeder = req.body.breeder;
    dog.sports = [].concat(req.body.sports);

    dog.save(function (err) {
      if (err) throw err;
      cb();
    });
  });
}
