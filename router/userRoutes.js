const express= require('express');

const path = require('path')

const router = express.Router();

const homecontroller  = require('../controller/usercontroller')

const expenseController = require('../controller/expenseController');

const authentication =require('../middleWare/auth')

router.get('/sign-in',homecontroller.signin);

router.get('/sign-up',homecontroller.signup);

router.post('/sign-up',homecontroller.signupPost);


router.post('/sign-in',homecontroller.signinPost);


router.get('/download',authentication.authenticate,expenseController.downloadexpense);

router.get('/downloadfiledata',authentication.authenticate,expenseController.downloadAllexpensedataFile)




module.exports = router;