const user = require('../model/usertable')
const Expense = require('../model/expensetable');
const sequelize = require('../model/database');

const getUserLeaderboard = async(req,res)=>{
  try {
    const userleaderboard =  await user.findAll({
     
      order:[['totalExpenses','DESC']]
    
    });
  
    res.status(201).json(userleaderboard)

  } catch (error) {
    console.log(error)
  }
 
   
};



module.exports ={
    getUserLeaderboard
}