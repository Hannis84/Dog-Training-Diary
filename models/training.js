var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Training = new Schema({
  userId: { type: String, required: true },
  date: String,
  goal: String,
  description: String,
});

mongoose.model('Training', Training);
