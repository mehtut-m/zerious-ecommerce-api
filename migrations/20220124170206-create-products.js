'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      hobby_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      sub_categories_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: Sequelize.DataTypes.DECIMAL(10, 2),
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  },
};
