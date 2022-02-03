module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      telephoneNo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: { name: 'userId', allowNull: false },
    });
  };
  return Address;
};
