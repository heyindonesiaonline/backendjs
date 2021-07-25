'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EmailSendLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sendType: {
        type: Sequelize.STRING
      },
      referenceId: {
        type: Sequelize.INTEGER
      },
      sendfrom: {
        type: Sequelize.STRING
      },
      sendto: {
        type: Sequelize.STRING
      },
      sendStatus: {
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
    return queryInterface.dropTable('EmailSendLogs');
  }
};