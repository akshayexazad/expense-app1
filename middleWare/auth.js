const jwt = require('jsonwebtoken');
const User = require('../model/usertable');

const  authenticate  = (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token,'secretKey');
        User.findByPk(user.userId).then(user=>{

          req.user = user;

            next()
        })

    
        
    } catch (error) {
        console.log(error)
    }

}
module.exports={
    authenticate
}