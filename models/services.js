module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
      service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Studio_id:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        default: 1,
      },
      seo_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      seo_description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
      },
      seo_slug: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      seo_tags: {
        type: DataTypes.JSON, 
        allowNull: true,
      },
    },
    {
      timestamps: true,
    });
  
    Service.associate = (models) => {
      Service.hasMany(models.Booking, {
        foreignKey: 'service_id', // Assuming your Booking model has a foreign key 'service_id' to associate with the Service model
        as: 'bookings', // Alias for the association, you can change it as needed
      });
    };
  
    return Service;
  };
  