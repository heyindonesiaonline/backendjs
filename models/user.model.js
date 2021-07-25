'use strict';
const bcrypt         = require('bcryptjs');
const bcrypt_p       = require('bcrypt-promise');
const jwt            = require('jsonwebtoken');
const {TE, to}       = require('../services/util.service');
const CONFIG         = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        first       : DataTypes.STRING,
        last        : DataTypes.STRING,
        email       : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: {msg: "Phone number invalid."} }},
        phone       : {type: DataTypes.STRING, allowNull: true, validate: { len: {args: [7, 20], msg: "Phone number invalid, too short."}, isNumeric: { msg: "not a valid phone number."} }},
        password    : DataTypes.STRING,
        roleId      : DataTypes.INTEGER,
        avatar      : {
                        type: DataTypes.BLOB, 
                        allowNull: true,
                        defaultValue: '/uploads/avatar.png',
                        get() {
                            return this.getDataValue('avatar') ? this.getDataValue('avatar').toString('utf8') : null;
                        },
                    },
        address     : {type: DataTypes.STRING, allowNull: true},
        city        : {type: DataTypes.STRING, allowNull: true},
        zipcode     : {type: DataTypes.INTEGER, allowNull: true},
        state       : {type: DataTypes.STRING, allowNull: true},
        country     : {type: DataTypes.STRING, allowNull: true},
        status      : {
                        type: DataTypes.SMALLINT, 
                        allowNull: false,
                        defaultValue: 1,
                    },
        fcm_reg_code: {
            type: DataTypes.STRING, 
            allowNull: false,
            defaultValue: "0",
        },
    });
    
    Model.associate = function(models){
        Model.hasMany(models.BiddingTransactions, { foreignKey: 'buyerId' });
        Model.hasMany(models.Stores, { foreignKey: 'userWinner' });
    };

    Model.beforeSave(async (user, options) => {
        let err;
        if (user.changed('password')){
            let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if(err) TE(err.message, true);
    
            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if(err) TE(err.message, true);
    
            user.password = hash;
        }
    });

    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if(!this.password) TE('password not set');
    
        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if(err) TE(err);
    
        if(!pass) TE('invalid password');
    
        return this;
    }

    Model.prototype.toWeb = function () {
        let json = this.toJSON();
        return json;
    };

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer "+jwt.sign({user_id:this.id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
    };

    return Model;
};