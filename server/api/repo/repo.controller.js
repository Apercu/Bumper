'use strict';

var github = require('../../github/github.service');
var Repo = require('./repo.model');

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
  Repo.find({ user: req.user._id }, function (err, repos) {
    if (err) { return handleError(res, err); }
    res.status(200).json(repos);
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
