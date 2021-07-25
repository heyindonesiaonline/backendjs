const { Stores, 
    Products, 
    User,  
    BiddingTransactions, 
    KeyTransactions, 
    ShippingDetails, 
    Uploads, StatusDesc } = require('../../../models');

const { to, ReE, ReS } = require('../../../services/util.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const statusList = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, listdata;

    [err, listdata] = await to(StatusDesc.findAll());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Status List', data:listdata}, 201);
}
module.exports.statusList = statusList;

const storeListByStatus = async function (req, res) {

}
module.exports.storeListByStatus = storeListByStatus;

const updateKeyPayExpiration = async function (req, res) {

}
module.exports.updateKeyPayExpiration = updateKeyPayExpiration;