'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('Users', 'phone'),
      queryInterface.changeColumn(
        'Users', // table name
        'phone', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'Users', // table name
        'phone', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        }
      )
    ]);
  }
};
