'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Keys', [{
      name: 'Wooden Key',
      description: 'Wooden Key',
      price: 2000.00,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Silver Key',
      description: 'Silver Key',
      price: 3000.00,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Gold Key',
      description: 'Gold Key',
      price: 4000.00,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Platinum Key',
      description: 'Platinum Key',
      price: 5000.00,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Keys', null, {});
  }
};
