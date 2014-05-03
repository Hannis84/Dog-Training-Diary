var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
  name: String,
  type: String,
  content: Buffer,
  userId: String
});

mongoose.model('Image', Image);
