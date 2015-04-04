'use strict';

var User = require('./user.model');
var github = require('../../github/github.service');

function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Return the current logged user.
 *
 * @param req
 * @param res
 */
exports.getMe = function (req, res) {
  var userId = req.user._id;
  User.findOne({ _id: userId }, '-accessToken -githubRepos', function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.json(401); }
    res.status(200).json(user);
  });
};

exports.getGithubRepos = function (req, res) {
  return res.status(200).json(req.user.githubRepos);
};

exports.fetchGithubRepos = function (req, res) {
  github.getRepos(req.user)
    .then(function (repos) {
      req.user.githubRepos = repos;
      req.user.save(function (err) {
        if (err) { return handleError(res, err); }
        res.status(200).json(repos);
      });
    })
    .catch(function (err) { handleError(res, err); });
};
