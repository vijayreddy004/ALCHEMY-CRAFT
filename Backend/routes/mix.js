const express = require('express');
const router = express.Router();
const mixController = require('../controllers/mixController');

router.get('/', mixController.mixElements);

module.exports = router;
