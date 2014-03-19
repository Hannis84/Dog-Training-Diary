var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var User = new Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  password: { type: String, required: true },
  firstName: String,
  lastName: String
});

mongoose.model('User', User);