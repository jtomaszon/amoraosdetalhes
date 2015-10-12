/*jslint node: true */
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id           : String,
  token        : String,
  email        : String,
  name         : String,
  halloween    : Boolean
});

module.exports = mongoose.model('User', userSchema);