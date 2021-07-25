'use strict';
module.exports = (sequelize, DataTypes) => {
  const AppSetting = sequelize.define('AppSetting', {
    appName: DataTypes.STRING,
    appLogo: {
        type: DataTypes.BLOB, 
        allowNull: true,
        defaultValue: '/uploads/avatar.png',
        get() {
            return this.getDataValue('appLogo') ? this.getDataValue('appLogo').toString('utf8') : null;
        },
    },
    appDescription: DataTypes.TEXT,
    companyName: DataTypes.STRING,
    companyLogo: {
        type: DataTypes.BLOB, 
        allowNull: true,
        defaultValue: '/uploads/avatar.png',
        get() {
            return this.getDataValue('companyLogo') ? this.getDataValue('companyLogo').toString('utf8') : null;
        },
    },
    companyDescription: DataTypes.TEXT,
    companyEmail: DataTypes.STRING,
    companyPhone: DataTypes.STRING,
    companyAddress: DataTypes.TEXT,
    companyState: DataTypes.STRING,
    companyCountry: DataTypes.STRING,
    companyZipcode: DataTypes.INTEGER
  }, {});
  AppSetting.associate = function(models) {
    // associations can be defined here
  };
  AppSetting.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };
  return AppSetting;
};