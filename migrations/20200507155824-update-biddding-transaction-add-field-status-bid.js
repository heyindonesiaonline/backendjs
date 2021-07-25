'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'BiddingTransactions', // table name
        'biddingStatus', // new field name
        {
          type: Sequelize.INTEGER,
          defaultValue: 1
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('BiddingTransactions', 'biddingStatus')
    ]);
  }
};
