'use strict';

var async = require('async');

var mongoose = require('mongoose');
var Training = mongoose.model('Training');
var Image = mongoose.model('Image');

var createImage = require('../helpers/image');

module.exports.get = function (req, res) {
  var id = req.user.id;

  Training.find({userId: id}, function (err, trainings) {
    if (err) throw err;

    async.map(trainings, function (training, cb) {
      var trainingObject = training.toObject();

      if (training.imageId !== '') {

        Image.findById(training.imageId, function (err, image) {
          if (err) throw err;
          var img = image.toObject();
          trainingObject.image = img.content;
          cb(err, trainingObject);
        });

      } else {
        cb(null, trainingObject);
      }
    },

    function (err, trainings) {
      if (err) throw err;
      res.send(trainings);
    });

  });
};

module.exports.getById = function (req, res) {
  var id = req.params.id;

  Training.findById(id, function (err, training) {
    if (err) throw err;

    if (training.imageId !== '') {
      var trainingObject = training.toObject();

      Image.findById(training.imageId, function (err, image) {
        if (err) throw err;
        var img = image.toObject();
        trainingObject.image = img.content;
        res.send(trainingObject);
      });

    } else {
      res.send(training);
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

module.exports.delete = function (req, res) {
  var id = req.params.id;
  Training.remove({_id: id}, function (err) {
    if (err) throw err;
    res.send(200);
  });
}

function create(req, imageId, cb) {
  if ("function" == typeof imageId) {
    cb = imageId;
    imageId = null;
  }

  var training = new Training({
    imageId: imageId || '',
    userId: req.user.id,
    date: req.body.date,
    goal: req.body.goal,
    description: req.body.description,
    type: req.body.type
  });

  training.save(function (err) {
    if (err) throw err;
    cb();
  });
}

function update(id, req, imageId, cb) {
  if ("function" == typeof imageId) {
    cb = imageId;
    imageId = null;
  }

  Training.findById(id, function (err, training) {
    if (imageId) training.imageId = imageId;
    training.date = req.body.date;
    training.goal = req.body.goal;
    training.description = req.body.description;
    training.type = req.body.type;

    training.save(function (err) {
      if (err) throw err;
      cb();
    });
  });
}
