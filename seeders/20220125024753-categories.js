'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'categories',
      [
        {
          name: 'Gaming Headphone',
          hobby_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Gaming Desk',
          hobby_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Gaming Keyboard',
          hobby_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
