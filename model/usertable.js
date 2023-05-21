const Sequelize = require('sequelize');
const sequelize = require('./database');

const User = sequelize.define('User',{
   id:{
             type:Sequelize.DataTypes.INTEGER,
             autoIncrement:true,
             
             primaryKey:true
         },
         name:{
             type:Sequelize.DataTypes.STRING,
       
           
         },
         email:{
             type:Sequelize.DataTypes.STRING,
             unique:true
     
     
         },
         password:{
             type:Sequelize.DataTypes.STRING,
   
         },
         ispremium:Sequelize.BOOLEAN,
         totalExpenses:{
            type:Sequelize.DataTypes.INTEGER,
            defaultValue:0,
         }
         
     });
 module.exports =User;