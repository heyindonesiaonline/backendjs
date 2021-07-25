'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'ShippingTypes', // table name
        'price', // new field name
        {
          type: Sequelize.FLOAT,
          allowNull: true,
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ShippingTypes', 'price')
    ]);
  }
};
