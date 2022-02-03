module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
      },
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
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
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

  User.associate = (models) => {
    User.hasMany(models.Order, {
      as: 'order',
      foreignKey: { name: 'userId', allowNull: false },
    });
    User.hasMany(models.Address, {
      as: 'address',
      foreignKey: { name: 'userId', allowNull: false },
    });
  };
  return User;
};
