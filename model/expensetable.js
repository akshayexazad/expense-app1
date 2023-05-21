const Sequelize = require('sequelize');
const sequelize = require('./database');

const Expense = sequelize.define('Expense',{
   id:{
             type:Sequelize.DataTypes.INTEGER,
             autoIncrement:true,
             
             primaryKey:true
         },
         price:{
             type:Sequelize.DataTypes.INTEGER,
             
       
           
         },
         category:{
             type:Sequelize.DataTypes.STRING,
             
     
     
         },
         description:{
             type:Sequelize.DataTypes.STRING,
   
         }
     });
 module.exports =Expense;