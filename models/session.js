module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
      session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      service_id:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      session_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instructor_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      session_duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      start_time:{
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time:{
        type: DataTypes.DATE,
        allowNull: true,
      },
      session_pricing: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      session_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      seo_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        default: 1, // status:2 for block sessions
      },
    },
    {
      timestamps: true,
    });
  
    return Session;
  };
  