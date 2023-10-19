module.exports = (sequelize, DataTypes) => {
    const Studio = sequelize.define(
      "studio",
      {
        Studio_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true, 
          },
        },
        studio_img :{
          type:DataTypes.STRING,
          allowNull: false,
        },
        contact_no: {
          type: DataTypes.STRING, // You can adjust the data type according to your requirements
          allowNull: false, // Set to false if it's a required field
        },
        description: {
          type: DataTypes.TEXT('long'),
          allowNull: false,
        },
        rating: {
          type: DataTypes.FLOAT, // Assuming rating can be a floating-point number
          allowNull: true,
          validate: {
            min: 0, // Minimum value for the rating
            max: 5, // Maximum value for the rating
          },
        },
        status: {
          type: DataTypes.BOOLEAN,
          default: 1,
        },
      },
      {
        timestamps: true,
      }
    );
    return Studio;
  };
  