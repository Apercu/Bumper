'use strict';

var _ = require('lodash');
var github = require('../../github/github.service');
var Repo = require('./repo.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of Repos (temporary including ones from github)
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  github.getRepos(req.user, {}, function (err, repos) {
    if (err) { return handleError(res, err); }
    res.status(200).json(repos);
  });
};
