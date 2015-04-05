'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./repo.controller');
var auth = require('../../auth/auth.service');

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
