'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RepoSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Repo', RepoSchema);
