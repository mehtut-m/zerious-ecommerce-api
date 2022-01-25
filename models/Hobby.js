module.exports = (sequelize, DataTypes) => {
  const Hobby = sequelize.define(
    'Hobby',
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

  Hobby.associate = (models) => {
    Hobby.hasMany(models.Category, {
      as: 'hobby',
      foreignKey: { name: 'hobbyId', allowNull: false },
    });
    // Hobby.hasMany(models.Product, {
    //   as: 'product',
    //   foreignKey: { name: 'hobbyId', allowNull: false },
    // });
  };
  return Hobby;
};
