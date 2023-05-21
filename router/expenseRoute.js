
const path = require('path');
const express = require('express');
const router = express.Router();
const usercontroller=require('../controller/expenseController');
const authentication = require('../middleWare/auth')


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../view/addexpense.html'))

})
// post router

router.post('/add-expensedata',authentication.authenticate,usercontroller.postexpense);

// get router

router.get('/getExpense',authentication.authenticate,usercontroller.getexpense);


// Delete Router

router.delete('/delete-expense/:id', authentication.authenticate,usercontroller.deleteexpense)

// update router



module.exports = router;
