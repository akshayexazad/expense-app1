const express = require('express');
const authentication = require('../middleWare/auth');
const premiumFeatureController= require('../controller/premiumFeaturecontroller')

router = express.Router();

router.get('/showleaderboard', authentication.authenticate,premiumFeatureController.getUserLeaderboard)

module.exports = router