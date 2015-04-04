'use strict';

var GitHubApi = require('github');
var async = require('async');
var q = require('q');
var Repo = require('../api/repo/repo.model.js');

var github = {

  /**
   * Create an authenticated github api
   *
   * @param user
   * @returns {GitHubApi}
   */
  getAuthenticatedApi: function (user) {

    var gh = new GitHubApi({ version: '3.0.0' });

    gh.authenticate({
      type: 'oauth',
      token: user.accessToken
    });

    return gh;

  },

  /**
   * Get repos list from github, for user
   *
   * @param user
   * @returns {Promise}
   */
  getRepos: function (user) {
    var def = q.defer();
    this.getAuthenticatedApi(user)
      .repos.getAll({ type: 'owner' }, function (err, repos) {
        if (err) { return def.reject(err); }
        repos = repos.map(simplifyGhRepo);
        async.each(repos, enrichGithubRepo, function (err) {
          if (err) { return def.reject(err); }
          console.log(repos);
          def.resolve(repos);
        });
      });

    function enrichGithubRepo (repo, done) {
      github.getPackageDotJson(user, repo)
        .then(function () { repo.havePackage = true; })
        .catch(function () { repo.havePackage = false; })
        .finally(done);
    }

    return def.promise;
  },

  /**
   * Get package.json from repo
   *
   * @param user
   * @param githubRepo
   */
  getPackageDotJson: function (user, githubRepo) {
    var def = q.defer();
    var api = this.getAuthenticatedApi(user);
    api.repos.getContent({
      user: githubRepo.owner,
      repo: githubRepo.name,
      path: 'package.json'
    }, function (err, pkg) {
      if (err) {
        if (err.code === 404) { err.message = 'No package.json'; }
        return def.reject(err);
      }
      pkg = new Buffer(pkg.content, 'base64').toString();
      def.resolve(pkg);
    });
    return def.promise;
  }

};

module.exports = github;

// utils

function simplifyGhRepo (r) {
  return {
    id: r.id,
    name: r.name,
    owner: r.owner.login
  };
}
