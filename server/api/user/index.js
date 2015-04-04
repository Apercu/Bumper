'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

router.get('/me', auth.isAuthenticated(), controller.getMe);
router.get('/github-repos', auth.isAuthenticated(), controller.getGithubRepos);
router.get('/fetch-github-repos', auth.isAuthenticated(), controller.fetchGithubRepos);

module.exports = router;
