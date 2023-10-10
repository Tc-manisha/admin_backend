module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
      service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
  
    return Service;
  };
  