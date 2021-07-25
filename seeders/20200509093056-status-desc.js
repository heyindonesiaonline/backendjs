'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('StatusDescs', [{
        statusType: 'payment',
        statusCode: 10,
        statusName: 'Waiting Payment',
        statusDesc: 'Waiting Payment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'payment',
        statusCode: 11,
        statusName: 'Payment Expired',
        statusDesc: 'Payment Expired',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'payment',
        statusCode: 12,
        statusName: 'Payment Paid',
        statusDesc: 'Payment Paid',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'payment',
        statusCode: 13,
        statusName: 'Payment Confirmed',
        statusDesc: 'Payment Confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'order',
        statusCode: 20,
        statusName: 'On Order',
        statusDesc: 'On Order',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'order',
        statusCode: 21,
        statusName: 'Order Confirmed',
        statusDesc: 'Order Confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'delivery',
        statusCode: 30,
        statusName: 'Packing On Warehouse',
        statusDesc: 'Packing On Warehouse',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'delivery',
        statusCode: 31,
        statusName: 'Item On Delivery',
        statusDesc: 'Item On Delivery',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'delivery',
        statusCode: 32,
        statusName: 'Item Arrived',
        statusDesc: 'Item Arrived',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        statusType: 'delivery',
        statusCode: 33,
        statusName: 'Finished',
        statusDesc: 'Finished',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StatusDescs', null, {});
  }
};
