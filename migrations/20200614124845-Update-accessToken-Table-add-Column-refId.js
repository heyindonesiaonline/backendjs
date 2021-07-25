'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'AccessTokens', // table name
        'refId', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'AccessTokens', // table name
        'token', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('AccessTokens', 'refId'),
      queryInterface.removeColumn('AccessTokens', 'token')
    ]);
  }
};
