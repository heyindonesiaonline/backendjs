'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('BiddingTransactions', 'shippingDetail', 'shippingDetailId');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('BiddingTransactions', 'shippingDetail', 'shippingDetailId');
  }
};
