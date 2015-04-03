'use strict';

var express = require('express');
var router = express.Router();
var config = require('../config/environment');
var User = require('../api/user/user.model');

require('./github/passport').setup(User, config);

router.use('/github', require('./github'));

module.exports = router;
