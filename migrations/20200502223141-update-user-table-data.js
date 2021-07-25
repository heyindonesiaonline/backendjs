'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'avatar', // new field name
        {
          type: Sequelize.BLOB('long'),
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Users', // table name
        'address', // new field name
        {
          type: Sequelize.TEXT('long'),
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Users', // table name
        'city', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Users', // table name
        'zipcode', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Users', // table name
        'state', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Users', // table name
        'country', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'avatar'),
      queryInterface.removeColumn('Users', 'address'),
      queryInterface.removeColumn('Users', 'city'),
      queryInterface.removeColumn('Users', 'zipcode'),
      queryInterface.removeColumn('Users', 'state'),
      queryInterface.removeColumn('Users', 'country'),
    ]);
  }
};
