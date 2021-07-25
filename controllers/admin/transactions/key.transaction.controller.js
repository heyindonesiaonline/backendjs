const { Stores, 
    Products, 
    User,  
    BiddingTransactions, 
    KeyTransactions, 
    ShippingDetails, 
    Uploads } = require('../../../models');

const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const confirmPayment = async function (req, res) {
    
}
module.exports.confirmPayment = confirmPayment;
