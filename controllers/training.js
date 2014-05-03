'use strict';
var mongoose = require('mongoose');
var Training = mongoose.model('Training');

module.exports.get = function (req, res) {
  var id = req.user.id;
  Training.find({userId: id}, function (err, trainings) {
    if (err) throw err;
    res.send(trainings);
  });
};

module.exports.getById = function (req, res) {
  var id = req.params.id;
  Training.findById(id, function (err, training) {
    if (err) throw err;
    res.send(training);
  });
};

module.exports.add = function (req, res) {
  var id = req.user.id;
  var training = new Training({userId: id, date: req.body.date, goal: req.body.goal, description: req.body.description, glyphicon: req.body.glyphicon})
  training.save(function (err) {
    if (err) throw err;
    res.send(200);
  });
};
