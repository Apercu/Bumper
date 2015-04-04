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
  github.getPackageDotJson(req.user, req.body)
    .then(function (packageDotJson) {
      res.status(200).json(packageDotJson);
    })
    .catch(function (err) { return handleError(res, err); });
};
