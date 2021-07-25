'use strict';
const bcrypt         = require('bcryptjs');
const bcrypt_p       = require('bcrypt-promise');
const jwt            = require('jsonwebtoken');
const {TE, to}       = require('../services/util.service');
const CONFIG         = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.SMALLINT
  }, {});
  Roles.associate = function(models) {
    // associations can be defined here
  };
  
  Roles.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };
  
  return Roles;
};