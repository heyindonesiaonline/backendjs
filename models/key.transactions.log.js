'use strict';
module.exports = (sequelize, DataTypes) => {
  const KeyTransactionsLogs = sequelize.define('KeyTransactionsLogs', {
    keyTransId: DataTypes.INTEGER,
    keyId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER,
    paymentMethod: DataTypes.INTEGER,
    paymentType: DataTypes.INTEGER,
    paymentStatus: DataTypes.INTEGER,
    paymentDate: DataTypes.DATE,
    useStatus: DataTypes.INTEGER,
  }, {});
  KeyTransactionsLogs.associate = function(models) {
    // KeyTransactionsLogs.hasOne(models.KeyTransactions, { foreignKey: 'keyTransId' });
  };
  KeyTransactionsLogs.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };
  return KeyTransactionsLogs;
};