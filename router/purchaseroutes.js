const express  = require('express');
const router = express.Router();
const purchaseController=require('../controller/purchaseController');
const authentication = require('../middleWare/auth')

router.get('/premiummembership',authentication.authenticate,purchaseController.purchasePremium);
router.post('/premiumUpdateStatus',authentication.authenticate,purchaseController.updateTransectionStatus);


module.exports =router;
