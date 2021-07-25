'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'ShippingDetails', // table name
        'tracking_code', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ShippingDetails', 'tracking_code')
    ]);
  }
};