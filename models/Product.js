module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      productImg: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    { underscored: true }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      as: 'category',
      foreignKey: { name: 'categoryId', allowNull: false },
    });
    Product.belongsTo(models.Brand, {
      as: 'brand',
      foreignKey: { name: 'brandId', allowNull: false },
    });
    Product.hasMany(models.OrderItem, {
      as: 'product',
      foreignKey: { name: 'productId', allowNull: false },
    });
  };
  return Product;
};
