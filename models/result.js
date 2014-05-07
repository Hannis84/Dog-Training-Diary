var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Result = new Schema({
  goal: String,
  plus: [String],
  minus: [String]
});

mongoose.model('Result', Result);
