'use strict';

var GitHubApi = require('github');

var github = {

  getAuthenticatedApi: function (user) {

    var gh = new GitHubApi({ version: '3.0.0' });

    gh.authenticate({
      type: 'oauth',
      token: user.accessToken
    });

    return gh;

  },

  getRepos: function (user, params, done) {
    this.getAuthenticatedApi(user)
      .repos.getAll({ type: 'owner' }, function (err, data) {
        if (err) { return done(err); }
        done(null, data.map(simplifyGhRepo));
      });
  }

};

module.exports = github;

// utils

function simplifyGhRepo (r) {
  return {
    name: r.name
  };
}
