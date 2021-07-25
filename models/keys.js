'use strict';
module.exports = (sequelize, DataTypes) => {
  const keys = sequelize.define('Keys', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    status: DataTypes.SMALLINT
  }, {});
  keys.associate = function(models) {
    // associations can be defined here
  };

  keys.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return keys;
};