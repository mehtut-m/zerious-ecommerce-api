module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define(
    'ProductImage',
    {
      productImg: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      //   as: 'productImg',
      foreignKey: { name: 'id', allowNull: false },
    });
  };
  return ProductImage;
};
