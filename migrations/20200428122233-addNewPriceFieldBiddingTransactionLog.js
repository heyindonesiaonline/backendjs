'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'BiddingTransactionsLogs', // table name
        'nominal', // new field name
        {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('BiddingTransactionsLogs', 'nominal')
    ]);
  }
};
