'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'brands',
      [
        {
          name: 'Razer',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Keychron',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Sony',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Banpresto',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Cougar',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('brands', null, {});
  },
};
