'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShippingTypes = sequelize.define('ShippingTypes', {
    shippingCode: DataTypes.CHAR,
    shippingName: DataTypes.STRING,
    shippingDescription: DataTypes.STRING,
    price: DataTypes.FLOAT,
    state: DataTypes.SMALLINT,
    country: DataTypes.STRING,
    estimate: DataTypes.STRING,
    status: DataTypes.SMALLINT
  }, {});
  ShippingTypes.associate = function(models) {
    // associations can be defined here
  };

  ShippingTypes.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };
  
  return ShippingTypes;
};