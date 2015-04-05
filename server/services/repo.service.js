'use strict';

var Repo = require('../api/repo/repo.model');
var User = require('../api/user/user.model');
var githubService = require('./github.service');
var davidService = require('./david.service');
var async = require('async');
var q = require('q');

var updateGithubCacheQueue = async.queue(function (task, done) {
  User.findById(task.userId, function (err, user) {
    if (err) { return done(err); }
    var repos = user.githubRepos;
    var index = typeof task.repo === 'string' ? repos.map(function (r) { return String(r.bumperId); }).indexOf(task.repo) : repos.map(function (r) { return r.id; }).indexOf(task.repo.infos.id);
    if (index === -1) { return done('Problem with db integrity.'); }
    repos[index].addedToBumper = task.addedToBumper;
    repos[index].bumperId = task.bumperId;
    user.markModified('githubRepos');
    user.save(done);
  });
});

/**
 * Get all bumper repos for given user
 *
 * @param userId
 * @returns {Promise}
 */
exports.getAllForUser = function (userId) {
  var def = q.defer();
  Repo.find({ user: userId }).lean().exec(function (err, repos) {
    if (err) { return def.reject(err); }
    repos.map(davidService.reduceDependencies);
    def.resolve(repos);
  });
  return def.promise;
};

/**
 * Create a bumper repo for given user, fetching deps from github
 *
 * @param user
 * @param repoInfos
 * @returns {*}
 */
exports.createForUser = function (user, repoInfos) {

  var def = q.defer();

  async.waterfall([

    // 1 - check if repo not exists
    function (done) {
      Repo.count({ 'infos.id': repoInfos.id }, function (err, count) {
        if (err) { return done(err); }
        if (count) { return done('Repo already exists.'); }
        done();
      });
    },

    // 2 - retrieve package.json
    function (done) {
      githubService.getPackageDotJson(user, repoInfos)
        .then(function (pkg) { done(null, pkg); })
        .catch(function (err) { done(err); });
    },

    // 3 - create repo object
    function (pkg, done) {
      Repo.create({
        infos: repoInfos,
        user: user._id,
        lastUpdate: new Date(),
        pkg: pkg
      }, done);
    },

    // 4 - update david deps
    function (repo, done) {
      davidService.retrieveDependencies(repo)
        .then(function () { repo.save(done); })
        .catch(done);
    },

    // 5 - update user github repo list
    function (repo, done) {
      updateGithubCacheQueue.push({
        userId: user._id,
        repo: repo,
        addedToBumper: true,
        bumperId: repo._id
      }, done);
    }

  ], function (err, repo) {
    if (err) { return def.reject(err); }
    def.resolve(repo);
  });

  return def.promise;

};

/**
 * Destroy repo for user
 *
 * @param user
 * @param repoId
 * @returns {Promise}
 */
exports.destroyForUser = function (user, repoId) {

  var def = q.defer();

  async.series([

    // 1 - remove repo object
    function (done) {
      Repo.findOne({ _id: repoId }, function (err, repo) {
        if (err) { return done(err); }
        if (!repo) { return done('Not found'); }
        if (String(repo.user) !== String(user._id)) { return res.status(401).end(); }
        repo.remove(done);
      });
    },

    // 2 - update user github repos cache
    function (done) {
      updateGithubCacheQueue.push({
        userId: req.user._id,
        repo: req.params.id,
        addedToBumber: false,
        bumperId: null
      }, function (err) {
        if (err) { return done(err); }
        done();
      });
    }

  ], function (err) {
    if (err) { return handleError(res, err); }
    res.status(200).end();
  });

  return def.promise;

};
