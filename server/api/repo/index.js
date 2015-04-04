'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./repo.controller');

router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);

module.exports = router;
