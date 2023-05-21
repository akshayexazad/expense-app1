const Sequelize = require('sequelize');
const sequelize = require('./database');

//id, name , password, phone number, role

const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
})

module.exports = Forgotpassword;