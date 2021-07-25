'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [{
      name: "Appliances",
      description: "Home And Office Appliances",
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Computers And Gadget",
      description: "Computers And Gadgets categories",
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Living",
      description: "Home, Townhouse, Apartment",
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
