const Sequelize = require('sequelize');
const sequelize = require('./database');

const Order = sequelize.define('order',{
    id: {
        type:Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentId:Sequelize.DataTypes.STRING,
    orderid:Sequelize.DataTypes.STRING,
    status:Sequelize.DataTypes.STRING
});

module.exports = Order;