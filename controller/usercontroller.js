const path = require('path')
const User = require('../model/usertable');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');

const signin = (req,res)=>{
    res.sendFile(path.join(__dirname,'../view/signin.html'))
}

const signup = (req,res)=>{
    res.sendFile(path.join(__dirname,'../view/signup.html'))
}
function isstringValid(string){
    if(string == undefined || string.length ===0 ){
     return true
    }else{
      return false
   }
   }

const signupPost = async(req,res)=>{
   
    try {
        const {name,email,password} = req.body;
    
    if(isstringValid(name)|| isstringValid(email)|| isstringValid(password)){
        res.status(400).json({msg: 'something is missing'})
      }

        
        const findmatch = await User.findOne({ where: {email:email}}) 
        if(findmatch===null){
            const addonstring =10;
            bcrypt.hash(password,addonstring,async(err,hash)=>{
                console.log(hash)
                const user = await User.create({name:name,email:email,password:hash});
               res.status(201).json({newuser:user})
            })
           
        }else {
            return res.status(401).json({newuser:"User alredy exist"})
        }
    } catch (error) {
        console.log(error)
       return res.status(500).json({message:error.message})
    }
   

}
function generateToken(id,name,ispremiumuser){
   return jwt.sign({userId:id,name:name,ispremiumuser},'secretKey')
}


const signinPost =async(req,res)=>{
    
    console.log('akshay')

    try {
        const {email,password}= req.body;
        if (isstringValid(email)|| isstringValid(password)){
            res.status(400).json({msg: 'something is missing'})
          }

        const  findmatch = await User.findOne({ where: {email:email}}) 
    
        if(findmatch===null){
          res.status(201).json({newuser:findmatch})
           
        }else{
             bcrypt.compare(password,findmatch.password,(err,result)=>{

                if(err){
                    res.status(401).json({newuser:err})

                }

                else if(result===true){
                    const token=jwt.sign({userId:findmatch.id,name:findmatch.name},'secretKey')
                    
                    res.status(201).json({newuser:'login successfull',token:generateToken(findmatch.id,findmatch.name,findmatch.ispremium)}) 
                }
                else{
                    res.status(401).json({message:'user not authorised'})
                }
             })
               
    
        }
    } catch (error) {
       return res.status(500).json({message:error.message})
    }
   

}





module.exports = {
    signin,
    signup,
    signupPost,
    signinPost,
    generateToken
}