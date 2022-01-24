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
      foreignKey: { name: 'hobbyId', allowNull: false },
    });
  };
  return Hobby;
};
