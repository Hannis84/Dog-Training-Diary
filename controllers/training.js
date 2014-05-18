'use strict';

var async = require('async');

var mongoose = require('mongoose');
var Training = mongoose.model('Training');
var Image = mongoose.model('Image');
var Dog = mongoose.model('Dog');
var Result = mongoose.model('Result');

var createImage = require('../helpers/image');

module.exports.get = function (req, res) {
  var id = req.user.id;

  Training.find({userId: id}, function (err, trainings) {
    if (err) throw err;

    async.map(trainings, function (training, cb) {
      var trainingObject = training.toObject();

      if (training.dogId !== '') {

        Dog.findById(training.dogId, function (err, dog) {
          if (err) throw err;
          if (dog) {
            trainingObject.dog = dog.toObject().name;
          } else {
            trainingObject.dog = '';
          }
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

  Training.findById(id)
    .populate('results')
    .exec(function (err, training) {
      if (err) throw err;

      if (training.imageId !== '') {
        var trainingObject = training.toObject();

        Image.findById(training.imageId, function (err, image) {
          if (err) throw err;
          var img = image.toObject();

          trainingObject.image = img.content;

          if (training.dogId !== '') {
            Dog.findById(training.dogId, function (err, dog) {
              trainingObject.dog = dog.toObject();

              if (dog.imageId !== '') {

                Image.findById(dog.imageId, function (err, image) {
                  if (err) throw err;
                  var img = image.toObject();
                  trainingObject.dog.image = img.content;
                  res.send(trainingObject);
                });

              } else {
                res.send(trainingObject);
              }

            });
          } else {
            res.send(trainingObject);
          }
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
    });

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
    });

  } else {
    update(id, req, function (status) {
      res.send(status);
    });
  }
};

module.exports.delete = function (req, res) {
  var id = req.params.id;
  Training.remove({_id: id}, function (err) {
    if (err) throw err;
    res.send(200);
  });
};

function saveResult(result, training, res) {
  result.save(function (err) {
    if (err) throw err;
    training.results = result._id;
    training.save(function (err) {
      if (err) throw err;
      res.send(200);
    });
  });
}

module.exports.results = function (req, res) {
  var result = new Result({
    goal: req.body.archieved,
    positive: req.body.positive.filter(function (result) { return result !== ''; }),
    negative: req.body.negative.filter(function (result) { return result !== ''; }),
    mood: req.body.mood || ''
  });

  Training.findById(req.params.id, function (err, training) {
    if (err) throw err;
    if (!training) return res.send(404);
    if (training.userId !== req.user.id) return res.send(401);

    if (training.results) {
      console.log('remove');
      Result.remove({_id: training.results}, function (err) {
        if (err) throw err;
        saveResult(result, training, res);
      });
    } else {
      saveResult(result, training, res);
    }
  });
};

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
    type: req.body.type,
    dogId: req.body.dog || ''
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

  Training.findById(id)
    .populate('results')
    .exec(function (err, training) {
      if (training.userId === req.user.id) {
        if (imageId) training.imageId = imageId;
        training.date = req.body.date;
        training.goal = req.body.goal;
        training.description = req.body.description;
        training.type = req.body.type;
        training.dogId = req.body.dog || training.dogId;

        training.save(function (err) {
          if (err) throw err;

          if ("undefined" !== typeof req.body.archieved) {
            var result = training.results;
            result.goal = req.body.archieved;
            result.positive = typeof req.body.positive == 'object' ? req.body.positive.filter(function (result) { return result !== ''; }) : req.body.positive;
            result.negative = typeof req.body.negative == 'object' ? req.body.negative.filter(function (result) { return result !== ''; }) : req.body.negative;
            result.mood = req.body.mood || '';
            result.save(function (err) {
              if (err) throw err;
              cb(200);
            });
          } else {
            cb(200);
          }
        });

      } else {
        cb(401);
      }
  });
}
