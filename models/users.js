'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  alias: String,
  email: String,
  password: String,
  role: String,
  image: String,
  description: String
});


module.exports = mongoose.model('User', UserSchema);
