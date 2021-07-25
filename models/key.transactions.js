'use strict';
module.exports = (sequelize, DataTypes) => {
  const KeyTransactions= sequelize.define('KeyTransactions', {
    keyId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER,
    paymentMethod: DataTypes.INTEGER,
    paymentType: DataTypes.INTEGER,
    paymentStatus: DataTypes.INTEGER,
    paymentDate: DataTypes.DATE,
    paymentExpired: DataTypes.DATE,
    useStatus: DataTypes.INTEGER,
  }, {});
  
  KeyTransactions.associate = function(models) {
    KeyTransactions.belongsTo(models.Keys, { foreignKey: 'keyId' });
  };

  KeyTransactions.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };
  return KeyTransactions;
};