var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Result = new Schema({
  goal: String,
  positive: [String],
  negative: [String],
  mood: String
});

mongoose.model('Result', Result);
