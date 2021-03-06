var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Training = new Schema({
  userId: { type: String, required: true },
  imageId: String,
  date: String,
  goal: String,
  description: String,
  type: String,
  dogId: String,
  results: { type: Schema.Types.ObjectId, ref: 'Result' }
});

mongoose.model('Training', Training);
