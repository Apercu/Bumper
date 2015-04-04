'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('github', {
    session: false,
    failure: '/'
  }))
  .get('/callback', passport.authenticate('github', {
    session: false,
    failureRedirect: '/'
  }), auth.setTokenCookie);

module.exports = router;
