module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        validate: {
          isNumeric: true,
          min: 0,
          max: 1,
        },
      },
    },
    { underscored: true }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      as: 'orderItem',
      foreignKey: { name: 'orderId', allowNull: false },
    });

    OrderItem.belongsTo(models.Product, {
      as: 'product',
      foreignKey: { name: 'productId', allowNull: false },
    });
  };

  return OrderItem;
};
