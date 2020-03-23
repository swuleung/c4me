const fs = require('fs');
const sequelize = require('sequelize');
const models = require('../models');
const path = require('path');

exports.deleteALLUsers = async (user) =>{
    
    console.log(db);
    db.user.destroy({
        where: {isAdmin:0},
        truncate: true
      })
}