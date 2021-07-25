'use strict';
module.exports = (sequelize, DataTypes) => {

  const AccessToken = sequelize.define('AccessToken', {
    type: DataTypes.STRING,
    url: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    expired: DataTypes.DATE,
    refId: {
              type: DataTypes.INTEGER, 
              allowNull: false,
              defaultValue: 0,
          },
    token: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            defaultValue: 0,
        },
  }, {});

  AccessToken.associate = function(models) {
    // associations can be defined here
  };

  AccessToken.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };
  
  return AccessToken;
};