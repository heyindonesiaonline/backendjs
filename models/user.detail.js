'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserDetails = sequelize.define('UserDetails', {
    userId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastname: DataTypes.STRING,
    avatar: DataTypes.TEXT,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    zipPostCode: DataTypes.INTEGER,
    country: DataTypes.STRING
  }, {});
  UserDetails.associate = function(models) {
    // associations can be defined here
  };

  UserDetails.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return UserDetails;
};