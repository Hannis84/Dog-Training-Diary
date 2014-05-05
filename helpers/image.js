'use strict';

var fs = require('fs');
var mongoose = require('mongoose');
var Image = mongoose.model('Image');

module.exports = function createImage(file, userId, cb) {
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
