const { Keys } = require('../../models');
const { KeyTransactions } = require('../../models');
const { KeyTransactionsLogs } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');

const keyList = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, keys;

    [err, keys] = await to(Keys.findAll({
        attributes: [
            [Sequelize.literal('id'),'id'],
            [Sequelize.literal('name'),'name'],
            [Sequelize.literal('description'),'description'],
            [Sequelize.literal('price - (price * (discount/100))'),'price'],
            [Sequelize.literal('discount'),'discount'],
            [Sequelize.literal('price'),'price_normal'],
            [Sequelize.literal('status'),'status'],
            [Sequelize.literal('disc_valid_from'),'disc_valid_from'],
            [Sequelize.literal('disc_valid_to'),'disc_valid_to'],
            [Sequelize.literal('createdAt'),'createdAt'],
            [Sequelize.literal('updatedAt'),'updatedAt']
        ]
    }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Keys List', data: keys}, 201);
}

module.exports.keyList = keyList;

const userKeyList = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, keys, user;
    user = req.user.dataValues;

    [err, keys] = await to(KeyTransactions.findAll({
                include: Keys,
                group: ['KeyTransactions.keyId'],
                attributes: ['keyId', [Sequelize.fn('COUNT', 'KeyTransactions.keyId'), 'count']],
                where: { buyerId : user.id, useStatus : 0 }
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load User Keys List', data: keys}, 201);
}

module.exports.userKeyList = userKeyList;

const orderKey = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, kt;
    let user = req.user.dataValues;
    let expiredDate = new Date();
    expiredDate = expiredDate.setHours(expiredDate.getHours() + 2); 
    let okey = [];
    req.body.forEach(function(keys, index, arr) {
        for(a = 1 ; a <= keys.count; a++) {
                okey.push({
                        keyId: keys.keyId,
                        buyerId: user.id,
                        paymentMethod: 0,
                        paymentType: 0,
                        paymentStatus: 10,
                        paymentDate: null,
                        paymentExpired: expiredDate
                });
        }
     });
    [err, kt] = await to(KeyTransactions.bulkCreate(okey));  

    if(err) return ReE(res, err, 422);
    
    return ReS(res,{message: 'Success Order Keys', data:kt}, 201);
}

module.exports.orderKey = orderKey;

const payKey = async function(req, res) {
    let err, ktf, ktu, data;
    let key = [];
    data = req.user.dataValues;
    [err, ktf] = await to(KeyTransactions.findAll({
        where: {
          buyerId: data.id,
          paymentStatus: 10
        }
    }));
    
    // [err, ktu] = await to(KeyTransactions.update(
    //     data,
    //     {where: {id: data.id} }
    // ));
    [err, ktu] = await to(Sequelize.Promise.each(ktf, function(val, index) {
        key.push(val.id);
        return KeyTransactions.update({
            paymentMethod: 2,
            paymentType: 1,
            paymentStatus: 12,
            paymentDate: new Date()
        },{
            where:{
                id: val.id
            },
            return: true
        })
    }));
    if(err) return ReE(res, err, 422);
    [err, ktu] = await to(KeyTransactions.findAll({
        where: {
          id: key
        }
    }));

    return ReS(res, {message:'Successfully Pay Current Key (s)', data:ktu}, 201);
}

module.exports.payKey = payKey;

const cancelOrder = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, kt;
    
    [err, kt] = await to(KeyTransactions.destroy({
        where: {
          id: req.body.id
        }
    }));

    if(err) return ReE(res, err, 422);

    return ReS(res,{message: 'Success Cancel Order Keys', data:kt}, 201);
    
}

module.exports.cancelOrder = cancelOrder;
