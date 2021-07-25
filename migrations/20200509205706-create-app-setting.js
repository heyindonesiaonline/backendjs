'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AppSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appName: {
        type: Sequelize.STRING
      },
      appLogo: {
        type: Sequelize.BLOB
      },
      appDescription: {
        type: Sequelize.TEXT
      },
      companyName: {
        type: Sequelize.STRING
      },
      companyLogo: {
        type: Sequelize.BLOB
      },
      companyDescription: {
        type: Sequelize.TEXT
      },
      companyEmail: {
        type: Sequelize.STRING
      },
      companyPhone: {
        type: Sequelize.STRING
      },
      companyAddress: {
        type: Sequelize.TEXT
      },
      companyState: {
        type: Sequelize.STRING
      },
      companyCountry: {
        type: Sequelize.STRING
      },
      companyZipcode: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AppSettings');
  }
};