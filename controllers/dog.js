'use strict';
var mongoose = require('mongoose');
var Dog = mongoose.model('Dog');

module.exports.get = function (req, res) {
  var id = req.user.id;
  Dog.find({userId: id}, function (err, dogs) {
    if (err) throw err;
    res.send(dogs);
  });
};

module.exports.add = function (req, res) {
  var id = req.user.id;
  var dog = new Dog({userId: id, name: req.body.name, fullname: req.body.fullname, breed: req.body.breed, breeder: req.body.breeder});
  dog.save(function (err) {
    if (err) throw err;
    res.send(200);
  });
};
