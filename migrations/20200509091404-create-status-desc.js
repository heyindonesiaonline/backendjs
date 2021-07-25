'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StatusDescs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      statusType: {
        type: Sequelize.STRING
      },
      statusCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      statusName: {
        type: Sequelize.STRING
      },
      statusDesc: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('StatusDescs');
  }
};