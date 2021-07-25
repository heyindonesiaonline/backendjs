'use strict';
// var dateTime = require('node-datetime');
var currDate = new Date();
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Stores', [{
      productId: 1,
      allowKey: 1,
      startBid: new Date(currDate.setDate(currDate.getDate() + 1)),
      endBid: new Date(currDate.setDate(currDate.getDate() + 5)),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      productId: 2,
      allowKey: 2,
      startBid: new Date(currDate),
      endBid: new Date(currDate.setDate(currDate.getDate() + 3)),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      productId: 3,
      allowKey: 3,
      startBid: new Date(currDate.setDate(currDate.getDate() + 2)),
      endBid: new Date(currDate.setDate(currDate.getDate() + 10)),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Stores', null, {});
  }
};
