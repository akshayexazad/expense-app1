const Expense = require('../model/expensetable');
const AWS = require('aws-sdk')

const User = require('../model/usertable');
const sequelize = require('../model/database');

const service =require('../service/userService')
const downloaddetail = require('../model/downloaddetail')

//Post controller

const postexpense = async(req,res,next)=>{
  const t = await sequelize.transaction();
   try {

    if(!req.body.price){
        throw new Error('Price is Mandetory')
    }

    const {price,category,description} = req.body;
    
    if(price == undefined || price.length === 0 ){
      return res.status(400).json({success: false, message: 'Parameters missing'})
 }
    
    const data = await Expense.create({price,category,description,UserId:req.user.dataValues.id},{transaction:t});
  

    const totalExpense = Number(req.user.totalExpenses)+Number(price);

     await User.update({totalExpenses:totalExpense},{where:{id:req.user.id},transaction:t});
     try {
      await t.commit()
    res.status(201).json({newuser:data});
     } catch (error) {
        await t.rollback()
        return res.status(500).json({success: false, error: err})
     }
    

}catch(error){
    await t.rollback()
    console.log('error in post request',JSON.stringify(error))
    res.status(500).json({err:error})};
};

//Get Controller

// const getexpense= async (req,res,next)=>{
//     try{
//     const users = await Expense.findAll();
//     res.status(200).json({alluser:users})
//     }
//     catch(err){
//         console.log('error in geting request',JSON.stringify(err))
//         res.status(500).json({err:err})
//     }
// };

const getexpense = async  (req,res,next)=>{
  const ITEMS_PER_PAGE=parseInt(req.query.param2);
  const pageNumber=parseInt(req.query.param1);
  const totalUserExpense = Expense.count({where:{userId:req.user.id}})
  .then(async(result)=>{
    console.log(result)

    const users = await Expense.findAll({where:{userId:req.user.id},
      offset:(pageNumber-1)*ITEMS_PER_PAGE,
      limit:ITEMS_PER_PAGE
    })
    if(users.length>0 && users!==null && users!==undefined){
      res.status(200).json({success:true,message:"Record fetch Successfully",users,ispremiumuser:req.user.ispremium,
      currentPage:pageNumber,
      hasNextPage:ITEMS_PER_PAGE*pageNumber<result,
      nextPage:parseInt(pageNumber)+1,
      hasPreviousPage:pageNumber>1,
      previousPage:pageNumber-1,
      lastPage:Math.ceil(result/ITEMS_PER_PAGE)
    })
    }else{
      res.status(200).json({success:true,msg:"No Record Found",users,ispremiumuser:req.user.ispremium});
    }
  })

}

//Delete Controller

const deleteexpense=async(req,res)=>{
  const t =  await sequelize.transaction()  
    try{
        if(req.params.id===undefined){
            console.log('ID missing')
        }
  const uid = req.params.id;
  const DataTobeDeleted = await Expense.findAll({where:{id:req.params.id},transaction:t});
 
     await Expense.destroy({where:{id:uid,userId:req.user.id},transaction: t});


  const  NewTotalExpense = Number(req.user.totalExpenses) - DataTobeDeleted[0].price;
   
  await  User.update({
    totalExpenses: NewTotalExpense
   },{
    where: { id: req.user.id},
      transaction: t
   })
   try{
    await t.commit()
    res.status(200).json({msg : 'successful'})
   }catch  (err){
   await t.rollback()
    return res.status(500).json({success: false, error: err})
   };

    }catch(err){
      await t.rollback()
        console.log(err);
        res.status(500).json({error:err})
        
    }
};



const downloadexpense = async (req,res)=>{
    try {
        const Expensess = await Expense.findAll({where:{UserId:req.user.id}});
        const StrigifyfieldExpensess = JSON.stringify(Expensess);
        const userId =req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await service.uploadToS3(StrigifyfieldExpensess, filename);
        await downloaddetail.create({
          filename: fileURL,
          downloaddate:Date(),
          UserId: req.user.id
      });
         res.status(200).json({fileURL,success:true})
    } catch (error) {
        console.log(error);
        res.status(500).json({fileURL:'',success:false,err:error})
    }
     
    
}
 

 

const downloadAllexpensedataFile = (async(req,res)=>{
  try {
    const downloadFileData = await downloaddetail.findAll({where:{UserId: req.user.id}});
    res.status(200).json({success:true,downloadFileData});
   } catch (error) {
    res.status(500).json({success:false,error:error});
}
})


module.exports={
    postexpense,
    getexpense,
    deleteexpense,
    downloadexpense,
    downloadAllexpensedataFile
}