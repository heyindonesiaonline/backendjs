'use strict';
module.exports = (sequelize, DataTypes) => {
  const StatusDesc = sequelize.define('StatusDesc', {
    statusType: DataTypes.STRING,
    statusCode: DataTypes.INTEGER,
    statusName: DataTypes.STRING,
    statusDesc: DataTypes.STRING,
  }, {});
  StatusDesc.associate = function(models) {
    // associations can be defined here
  };
  return StatusDesc;
};