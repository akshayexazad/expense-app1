const path = require('path');
const express = require('express');
const router = express.Router();
const authentication = require('../middleWare/auth')
const forgot_passwors_controller = require('../controller/forget_password_controller');

router.get('/forgotpage',(req,res)=>{
    res.sendFile(path.join(__dirname,'../view/forget_password.html'))
})

router.post('/updatepassword/:resetpasswordid',forgot_passwors_controller.updatepassword)

router.get('/resetpassword/:id', forgot_passwors_controller.resetpassword)

router.use('/forgotpassword', forgot_passwors_controller.forgotpassword)



module.exports = router;

