'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  githubId: String,
  username: String,
  email: String
});

module.exports = mongoose.model('User', UserSchema);
