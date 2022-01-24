module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define(
    'SubCategory',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );

  SubCategory.associate = (models) => {
    SubCategory.belongsTo(models.Category, {
      foreignKey: { name: 'categoryId', allowNull: false },
    });
  };

  return SubCategory;
};
