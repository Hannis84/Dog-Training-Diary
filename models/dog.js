var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Dog = new Schema({
  userId: { type: String, required: true },
  name: String,
  fullname: String,
  breed: String,
  breeder: String
});

mongoose.model('Dog', Dog);
