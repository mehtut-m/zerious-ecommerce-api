'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sub-categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      category_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'categories',
          },
          key: 'id',
        },
      },
    });
  },

  // when UNDO down function wii be called
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sub-categories');
  },
};
