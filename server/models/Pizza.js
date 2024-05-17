module.exports = (sequelize, DataTypes) => {
    const Pizza = sequelize.define('Pizza', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
      },
    }, {
      timestamps: true,
    });
  
    return Pizza;
  };
  