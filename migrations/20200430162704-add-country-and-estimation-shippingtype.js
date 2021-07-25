'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'ShippingTypes', // table name
        'country', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'ShippingTypes', // table name
        'estimate', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ShippingTypes', 'country'),
      queryInterface.removeColumn('ShippingTypes', 'estimate')
    ]);
  }
};