'use strict';

var Repo = require('./repo.model');
var User = require('../user/user.model');
var github = require('../../services/github.service');
var david = require('../../services/david.service');
var async = require('async');

function handleError (res, err) {
  return res.status(err.code || 500).send(err.message || err);
}

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
 * Get list of Repos (temporary including ones from github)
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Repo.find({ user: req.user._id }).lean().exec(function (err, repos) {
    if (err) { return handleError(res, err); }
    repos.map(david.reduceDependencies);
    res.status(200).json(repos);
  });
};

exports.create = function (req, res) {

  async.waterfall([

    // 1 - check if repo not exists
    function (done) {
      Repo.count({ 'infos.id': req.body.id }, function (err, count) {
        if (err) { return handleError(res, err); }
        if (count) { return done('Repo already exists.'); }
        done();
      });
    },

    // 2 - retrieve package.json
    function (done) {
      github.getPackageDotJson(req.user, req.body)
        .then(function (pkg) { done(null, pkg); })
        .catch(function (err) { done(err); });
    },

    // 3 - create repo object
    function (pkg, done) {
      Repo.create({
        infos: req.body,
        user: req.user._id,
        lastUpdate: new Date(),
        pkg: pkg
      }, done);
    },

    // 4 - update david deps
    function (repo, done) {
      david.retrieveDependencies(repo)
        .then(function () {
          repo.save(function (err, repo) {
            if (err) { return done(err); }
            done(null, repo);
          });
        })
        .catch(done);
    },

    // 5 - update user github repo list
    function (repo, done) {
      updateGithubCacheQueue.push({
        userId: req.user._id,
        repo: repo,
        addedToBumper: true,
        bumperId: repo._id
      }, function (err) {
        if (err) { return done(err); }
        done(null, repo);
      });
    }

  ], function (err, repo) {
    if (err) { return handleError(res, err); }
    res.status(201).json(repo);
  });
};

exports.destroy = function (req, res) {

  async.series([

    // 1 - remove repo object
    function (done) {
      Repo.findOne({ _id: req.params.id }, function (err, repo) {
        if (err) { return handleError(res, err); }
        if (!repo) { return res.status(404).end(); }
        if (String(repo.user) !== String(req.user._id)) { return res.status(401).end(); }
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
};
