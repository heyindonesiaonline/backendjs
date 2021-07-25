'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'ShippingTypes', // table name
        'state', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ShippingTypes', 'state')
    ]);
  }
};
