'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KeyTransactionsLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keyTransId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'KeyTransactions',
          key: 'id'
        }
      },
      keyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Keys',
          key: 'id'
        }
      },
      buyerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      paymentMethod: {
        type: Sequelize.INTEGER
      },
      paymentType: {
        type: Sequelize.INTEGER
      },
      paymentStatus: {
        type: Sequelize.INTEGER
      },
      paymentDate: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('KeyTransactionsLogs');
  }
};