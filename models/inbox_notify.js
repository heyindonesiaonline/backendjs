'use strict';
module.exports = (sequelize, DataTypes) => {
  const inbox_notifies = sequelize.define('inbox_notifies', {
    fcm_code: DataTypes.STRING,
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    type: DataTypes.STRING,
    deeplink: DataTypes.STRING,
    read: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  inbox_notifies.associate = function(models) {
    // associations can be defined here
  };
  return inbox_notifies;
};