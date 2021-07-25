'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Emails', {
    email: DataTypes.STRING
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