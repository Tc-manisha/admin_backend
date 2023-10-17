module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User",
      {
        user_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true, 
          },
        },
        password: {
          type: DataTypes.STRING, 
          allowNull: false,
        },
        user_img :{
          type:DataTypes.STRING,
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING, 
          allowNull: true, 
        },
       
      },
      {
        timestamps: true,
      }
    );
    
    return User;
  };
 