'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Categories', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.INTEGER
  });
  Model.associate = function(models) {
    // associations can be defined here
  };

  Model.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return Model;
};