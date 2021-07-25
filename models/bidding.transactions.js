'use strict';
module.exports = (sequelize, DataTypes) => {
  const BiddingTransactions = sequelize.define('BiddingTransactions', {
    productId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER,
    nominal: DataTypes.FLOAT,
    paymentMethod: DataTypes.INTEGER,
    paymentType: DataTypes.INTEGER,
    paymentStatus: DataTypes.INTEGER,
    paymentDate: DataTypes.DATE,
    shippingType: DataTypes.INTEGER,
    shippingStatus: DataTypes.INTEGER,
    shippingDetailId: DataTypes.INTEGER,
    biddingStatus: {
                  type: DataTypes.SMALLINT, 
                  allowNull: false,
                  defaultValue: 1,
                },
  }, {});
  BiddingTransactions.associate = function(models) {
    BiddingTransactions.belongsTo(models.Stores, { foreignKey: 'storeId' });
    BiddingTransactions.belongsTo(models.Products, { foreignKey: 'productid' });
    BiddingTransactions.belongsTo(models.User, { foreignKey: 'buyerId' });
    BiddingTransactions.belongsTo(models.StatusDesc, { foreignKey: 'paymentStatus', as: 'payStatus' });
    BiddingTransactions.belongsTo(models.StatusDesc, { foreignKey: 'shippingStatus', as: 'shipStatus' });
    BiddingTransactions.belongsTo(models.ShippingDetails, { foreignKey: 'shippingDetailId'});
  };
  BiddingTransactions.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };
  return BiddingTransactions;
};