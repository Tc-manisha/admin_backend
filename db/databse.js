require("dotenv").config();
const { Sequelize, Datatype, model } = require("sequelize");
const { Op } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);
try{
    sequelize.authenticate();
    console.log('connection succesfully')
}
catch(error){console.error("unable to connect")
return res.status(400).send({msg:"unable to connect",err:error})
}
const db = {};

db.Sequelize = Sequelize;
db.sequelize=sequelize;
db.Admin = require('../models/Admin')(sequelize,Sequelize);
db.user = require('../models/user')(sequelize,Sequelize);
db.services = require('../models/services')(sequelize,Sequelize);
db.session = require('../models/session')(sequelize,Sequelize);
db.Studio = require('../models/studio')(sequelize,Sequelize);
db.booking = require('../models/booking')(sequelize,Sequelize);
db.sequelize.sync({force:false}).
then(()=>{
    console.log("yes re-sync")
})
module.exports = db;
