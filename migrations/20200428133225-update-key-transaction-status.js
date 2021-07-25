'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'KeyTransactions', // table name
        'useStatus', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
      ),
      queryInterface.addColumn(
        'KeyTransactionsLogs', // table name
        'useStatus', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('KeyTransactions', 'useStatus'),
      queryInterface.removeColumn('KeyTransactionsLogs', 'useStatus')
    ]);
  }
};