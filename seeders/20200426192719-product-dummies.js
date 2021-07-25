'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [{
      name: "Macbook Pro Touch Bar 2019",
      categoryId: 2,
      description: "Bidding To Give Present",
      price: 200000000,
      images: "",
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Legacy Town House",
      categoryId: 3,
      description: "Bid And Win For Nice Living",
      price: 90000000000,
      images: "",
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Modena Refrigerator",
      categoryId: 2,
      description: "Fill Press And Win To Feel Fresh",
      price: "400000000",
      images: "",
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
