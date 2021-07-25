'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'ShippingDetails', // table name
        'courier_name', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ShippingDetails', 'courier_name')
    ]);
  }
};