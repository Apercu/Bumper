'use strict';

var repoService = require('../../services/repo.service.js');

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
  repoService.getAllForUser(req.user._id)
    .then(function (repos) { res.status(200).json(repos); })
    .catch(function (err) { handleError(res, err); });
};

/**
 * Create a repo
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  repoService.createForUser(req.user, req.body)
    .then(function (repo) { res.status(201).json(repo); })
    .catch(function (err) { handleError(res, err); })
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

exports.getOne = function (req, res) {
  Repo.findOne({ 'infos.owner': req.params.owner, 'infos.name': req.params.repo }, '-pkg', function (err, repo) {
    if (err) { return handleError(res, err); }
    if (!repo) { return handleError(res, 'Not found'); }
    res.status(200).json(repo);
  });
};
