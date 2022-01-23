module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
      },
      facebookId: {
        type: DataTypes.STRING,
        unique: true,
      },
      profileImg: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USER',
        validate: {
          isIn: [['USER', 'ADMIN']],
        },
      },
    },
    { underscored: true }
  );

  // User.associate = (models) => {};
  return User;
};
