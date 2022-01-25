'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'products',
      [
        {
          brand_id: 1,
          category_id: 1,
          name: 'Razer Wind',
          price: 1000.25,
          description: 'This is description',
          quantity: 20,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          brand_id: 1,
          category_id: 2,
          name: 'Razer Basilisk',
          price: 2000.25,
          description: 'This is description',
          quantity: 20,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          brand_id: 1,
          category_id: 3,
          name: 'Razer Kraken',
          price: 10002.25,
          description: 'This is description',
          quantity: 20,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};
