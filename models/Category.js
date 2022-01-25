module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
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

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      as: 'category',
      foreignKey: { name: 'categoryId', allowNull: false },
    });
    Category.belongsTo(models.Hobby, {
      as: 'hobby',
      foreignKey: { name: 'hobbyId', allowNull: false },
    });
  };
  return Category;
};
