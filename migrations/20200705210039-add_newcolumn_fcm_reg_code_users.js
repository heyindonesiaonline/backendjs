'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'fcm_reg_code', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: false
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'fcm_reg_code')
    ]);
  }
};