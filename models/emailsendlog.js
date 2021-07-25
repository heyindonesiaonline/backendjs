'use strict';
module.exports = (sequelize, DataTypes) => {
  const EmailSendLog = sequelize.define('EmailSendLog', {
    sendType: DataTypes.STRING,
    referenceId: DataTypes.INTEGER,
    sendfrom: DataTypes.STRING,
    sendto: DataTypes.STRING,
    sendStatus: DataTypes.INTEGER
  }, {});
  EmailSendLog.associate = function(models) {
    // associations can be defined here
  };
  return EmailSendLog;
};