'use strict';

var path = require('path');
var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  githubId: '9722d93aa3e535810895',
  githubSecret: process.env.GITHUB_SECRET,

  secrets: {
    session: process.env.SESSION_SECRET || 'secretKey'
  }
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
