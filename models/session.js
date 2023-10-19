module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    "Session",
    {
      session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      service_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      session_img :{
        type:DataTypes.STRING,
        allowNull: false,
      },
      session_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      instructor_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      session_duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      session_pricing: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      session_type: {
        type: DataTypes.STRING,
        allowNull: false,
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
    }
  );

  return Session;
};
