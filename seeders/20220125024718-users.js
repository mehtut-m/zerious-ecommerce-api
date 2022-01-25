'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          first_name: 'Test',
          last_name: 'User1',
          role: 'USER',
          email: 'test1@gmail.com',
          password: bcrypt.hashSync('qwerty', 12),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          first_name: 'Test',
          last_name: 'User2',
          email: 'test2@gmail.com',
          role: 'USER',
          password: bcrypt.hashSync('qwerty', 12),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          first_name: 'Test',
          last_name: 'User3',
          email: 'test3@gmail.com',
          role: 'ADMIN',
          password: bcrypt.hashSync('qwerty', 12),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
