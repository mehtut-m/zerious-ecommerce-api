'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      first_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      profile_img: {
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      facebook_id: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      google_id: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
      },
      phone_number: {
        type: Sequelize.DataTypes.STRING,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
      },
      role: {
        type: Sequelize.DataTypes.ENUM('USER', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USER',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  // when UNDO down function wii be called
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
