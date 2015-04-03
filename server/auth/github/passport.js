'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var GithubStrategy = require('passport-github').Strategy;

exports.setup = function (User) {
  passport.use(new GithubStrategy({
      clientID: config.githubId,
      clientSecret: config.githubSecret,
      callbackURL: 'http://localhost:9000/auth/github/callback',
      scope: ['public_repo']
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ githubId: profile.id }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          user = new User({
            githubId: profile.id,
            username: profile.username
          });
          user.save(function (err) {
            if (err) { return done(err); }
            done(null, user);
          });
        } else {
          done(null, user);
        }
      });
    }
  ));
};
