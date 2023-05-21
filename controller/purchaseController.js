
const purchase = require('../model/purchasetable');
const razorpay = require('razorpay');
const userController = require('./usercontroller')
// const orders =require('../model/ordertable')
const dotenv = require('dotenv');
dotenv.config();
const purchasePremium =async(req,res)=>{
    try {
        var rzp = new razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET 


        });
        const amount = 2500;
       rzp.orders.create({amount,currency:"INR"},(err,order)=>{
        if(err){
            console.log(err)
            throw new Error(err)
        }
        req.user.createOrder({orderid:order.id,status:"PENDING"}).then(()=>{
            return res.status(200).json({order,key_id:rzp.key_id})
        }).catch(err=>{
            throw new Error(err)
        })

       })
    } catch (error) {
        console.log(error)
        res.status(401).json({message:'somthing went wrong ',Error:error})
        
    }
}
const updateTransectionStatus =  async(req,res)=>{
    // console.log(req)
    try {
        const userId = req.user.id;
        const { payment_id,order_id}= req.body;
        const order = await purchase.findOne({where:{orderid:order_id}})
        const promise1= await    order.update({paymentId:payment_id,status:"Succesfull"})
        const  promise2 = await req.user.update({ispremium:true})

        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({success:true,message:"transection Successfull",token:userController.generateToken(userId,undefined,true)})
        }).catch((err)=>{
            throw new Error(err)
        })
  
    } catch (error) {
       throw new Error(error) 
    }
}

module.exports ={
    purchasePremium,
    updateTransectionStatus
}