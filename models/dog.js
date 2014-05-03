var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Dog = new Schema({
  userId: { type: String, required: true },
  imageId: String,
  name: String,
  fullname: String,
  breed: String,
  breeder: String,
  sports: []
});

mongoose.model('Dog', Dog);
