const Sequelize=require('sequelize');
const sequelize=require('../config/db')
const db={}
db.Sequelize=Sequelize
db.sequelize=sequelize
db.Image=require('./Image')(Sequelize,sequelize);
db.User=require('./User')(Sequelize,sequelize);
db.User.hasMany(db.Image, {
  foreignKey: "userId"
});

db.Image.belongsTo(db.User, {
  foreignKey: "userId"
});
module.exports=db;