'use strict';

var User = require('./user.model');

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
  User.findOne({
    _id: userId
  }, '-accessToken', function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.json(401); }
    res.status(200).json(user);
  });
};
