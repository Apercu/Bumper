'use strict';

var github = require('../../github/github.service');
var Repo = require('./repo.model');
var async = require('async');
var david = require('david');

function handleError (res, err) {
  return res.status(err.code || 500).send(err.message || err);
}

/**
 * Get list of Repos (temporary including ones from github)
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Repo.find({ user: req.user._id }).lean().exec(function (err, repos) {
    if (err) { return handleError(res, err); }
    async.eachLimit(repos, 10, retrieveDependencies, function (err) {
      if (err) { return handleError(res, err); }
      res.status(200).json(repos);
    });
  });
};

exports.create = function (req, res) {
  Repo.find({ 'infos.id': req.body.id }, function (err, repos) {
    if (err) { return handleError(res, err); }
    if (repos.length) { return handleError(res, 'Repo already exists.'); }

    github.getPackageDotJson(req.user, req.body)
      .then(function (packageDotJson) {
        Repo.create({
          infos: req.body,
          user: req.user._id,
          lastUpdate: new Date(),
          pkg: packageDotJson
        }, function (err, repo) {
          if (err) { return handleError(res, err); }
          res.status(200).json(repo);
        });
      })
      .catch(function (err) { return handleError(res, err); });

  });
};

exports.destroy = function (req, res) {
  Repo.findOne({ _id: req.params.id }, function (err, repo) {
    if (err) { return handleError(res, err); }
    if (!repo) { return res.status(404).end(); }
    if (String(repo.user) !== String(req.user._id)) { return res.status(401).end(); }
    repo.remove(function (err) {
      if (err) { return handleError(res, err); }
      res.status(200).end();
    });
  });
};

function listDependencies (deps) {
  var out = [];
  Object.keys(deps).forEach(function (depName) {
    out.push({
      name: depName,
      required: deps[depName].required || '*',
      stable: deps[depName].stable || 'None',
      latest: deps[depName].latest
    });
  });
  return out;
}

function retrieveDependencies (repo, done) {

  var pkg = JSON.parse(repo.pkg);
  delete repo.pkg;

  async.parallel([

    // get dependencies
    function (done) {
      david.getDependencies(pkg, function (err, deps) {
        if (err) { return done(err); }
        repo.deps = listDependencies(deps);
        done();
      });
    },

    // get dev-dependencies
    function (done) {
      david.getDependencies(pkg, { dev: true }, function (err, deps) {
        if (err) { return done(err); }
        repo.devDeps = listDependencies(deps);
        done();
      });
    }

  ], done);

}
