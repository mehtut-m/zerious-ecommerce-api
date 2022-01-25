'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'hobbies',
      [
        {
          name: 'Gaming',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Desk Decorating',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Gadgets',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Entertainment',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Collectible',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Smart Home',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hobbies', null, {});
  },
};
