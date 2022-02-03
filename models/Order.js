module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'PENDING',
        validate: {
          notEmpty: true,
        },
      },
      tracking: {
        type: DataTypes.STRING,
        unique: true,
      },
      discount: {
        type: DataTypes.STRING,
        defaultValue: 0,
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      as: 'user',
      foreignKey: { name: 'userId', allowNull: false },
    });
    Order.hasMany(models.OrderItem, {
      as: 'orderItem',
      foreignKey: { name: 'orderId', allowNull: false },
    });
  };
  return Order;
};
