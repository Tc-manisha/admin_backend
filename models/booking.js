module.exports = (sequelize, DataTypes) => {
    const BookingSession = sequelize.define('BookingSession', {
      booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      booking_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      booking_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending', // Default value is set to 'pending'
    },
    payment_status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment: {
        type: DataTypes.FLOAT, // Assuming the price is a floating-point number
        allowNull: true,
      },
    });
    
   
    return BookingSession;
  };
  