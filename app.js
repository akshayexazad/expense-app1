const express = require('express');

const cors = require('cors');


const fs = require('fs')

const helmet  = require('helmet');

const morgan = require('morgan')

const dotenv = require('dotenv');

require('dotenv').config();

const path = require('path')

const bodyparser = require('body-parser');

const User = require('./model/usertable');

const Expense = require('./model/expensetable');


const premium = require('./model/purchasetable');

const Forgotpassword = require('./model/forgotpassword')

const Download = require('./model/downloaddetail')

const sequelize = require('./model/database');

const accesLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

const app = express();

app.use(cors())

// app.use(helmet())

app.use(morgan('combined',{stream:accesLogStream}))
// app.use(express.static('view'))

app.use(bodyparser.json())

app.use(bodyparser.urlencoded({extended:true}));


// app.use(
//    helmet.contentSecurityPolicy({
//      directives: {
//        defaultSrc: ["'self'", 'data:', 'blob:'],
  
//        fontSrc: ["'self'", 'https:', 'data:'],
 
//        scriptSrc: ["'self'", 'unsafe-inline'],
  
//        scriptSrc: ["'self'", 'https://*.cloudflare.com'],
  
//        scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
  
//        styleSrc: ["'self'", 'https:', 'unsafe-inline'],
  
//        connectSrc: ["'self'", 'data', 'https://*.cloudflare.com']
//      },
//    })
//  );

app.use('/user',require('./router/userRoutes'));

app.use('/expense',require('./router/expenseRoute'));

app.use('/purchase',require('./router/purchaseroutes'));

app.use('/premium',require('./router/premiumFeatureRouter'));

app.use('/password',require('./router/forget_password_route'));


// app.use('/',(req,res)=>{
//    res.sendFile(path.join(__dirname,''))
// })

 app.use((req,res)=>{
   res.sendFile(path.join(__dirname,`view/${req.url}`))
 })
   

   User.hasMany(Expense);

   Expense.belongsTo(User)
    

   User.hasMany(premium);

   premium.belongsTo(User)

   User.hasMany(Forgotpassword);

   Forgotpassword.belongsTo(User);

   User.hasMany(Download);
   Download.belongsTo(User)



   
   // sequelize.sync().then(()=>{
   //  app.listen(3000)
   // }).catch((err)=>{
   //    console.log(err)
      
   // })
   app.listen(3000,()=>{
      console.log('app running on 3000')
   })



