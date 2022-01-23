module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    'Brand',
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

  // Brand.associate = (models) => {};
  return Brand;
};
