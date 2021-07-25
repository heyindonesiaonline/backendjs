'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stores = sequelize.define('Stores', {
    productId: DataTypes.INTEGER,
    allowKey: DataTypes.STRING,
    startBid: DataTypes.DATE,
    endBid: DataTypes.DATE,
    userWinner: DataTypes.INTEGER,
    setWinnerDate: DataTypes.DATE,
    setWinnerBy: DataTypes.INTEGER,
    maxbidder: DataTypes.INTEGER,
    status: DataTypes.SMALLINT
  }, {});
  Stores.associate = function(models) {
    Stores.belongsTo(models.User, { foreignKey: 'userWinner' });
    Stores.belongsTo(models.Products, { foreignKey: 'productId' });
    Stores.hasMany(models.BiddingTransactions,{as: 'bidder'});
    Stores.hasMany(models.BiddingTransactions,{as: 'listBidders'});
    Stores.hasMany(models.BiddingTransactions,{as: 'winner'});
    Stores.hasMany(models.BiddingTransactions);
  };

  Stores.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };
  return Stores;
};