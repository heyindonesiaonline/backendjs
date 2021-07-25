'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [{
      name: 'Super Admin',
      description: 'Highest Administration',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Admin Content',
      description: 'Content Administration Editor',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Admin Viewer',
      description: 'Content Administration Viewer',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Seller',
      description: 'Bidder Seller',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Customers',
      description: 'End Users Customer',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
