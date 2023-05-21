const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();


const uploadToS3 = (data,filename)=>{
  
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
    let accessS3= new AWS.S3({
      accessKeyId:IAM_USER_KEY,
      secretAccessKey:IAM_USER_SECRET,
      
    })
  
      var params = {
      Bucket:BUCKET_NAME,
      Key:filename,
      Body:data,
      ACL:'public-read'
     }
    
  return new Promise((resolve,reject)=>{
       accessS3.upload(params,(err,s3data)=>{
          if(err){
            console.log('somthing went wrong in s3 bucket')
            reject(err)
          }else{
              
          //   console.log('sucess',s3data)
            resolve(s3data.Location)
           
          }
       })
  })
      
  }

  module.exports ={
    uploadToS3
  }