const { Stores } = require('../../models');
const { Products } = require('../../models');
const { User } = require('../../models');
const { BiddingTransactions } = require('../../models');
const { KeyTransactions } = require('../../models');
const { ShippingDetails } = require('../../models');
const { Uploads } = require('../../models');
const iPayTotal = require('../../services/ipaytotal');
const { to, ReE, ReS } = require('../../services/util.service');
const  fcmService = require('../../services/fcm.notification.services'); 
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

var response = require('../../response/res');
var connection = require('../../config/conn');

const storeList = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores;

    [err, stores] = await to(Stores.findAll({ 
        include: [ 
            { 
                model: Products,
                include: [
                    {
                        model: Uploads,
                        as: 'productImages',
                        attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                        on: {
                            '$Product.name$': { [Op.col]: 'content' },
                            '$Product.id$': { [Op.col]: 'contentId' },
                        }
                    }
                ]
            }, 
            {
                model: BiddingTransactions,
                on: {
                    '$Stores.id$': { [Op.col]: 'storeId' },
                    '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                },
                include: [
                    { model: User }
                ]
            }
        ]
     }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores List', data:stores}, 201);
}
module.exports.storeList = storeList;

const storeListDetail = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, store;

    [err, store] = await to(Stores.findOne({ 
        where: {
            id: req.params.id

        },
        include: [ 
            { 
                model: Products,
                include: [
                    {
                        model: Uploads,
                        as: 'productImages',
                        attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                        on: {
                            '$Product.name$': { [Op.col]: 'content' },
                            '$Product.id$': { [Op.col]: 'contentId' },
                        }
                    }
                ]
            }, 
            { 
                model: BiddingTransactions, 
                on: {
                    '$Stores.id$': { [Op.col]: 'storeId' },
                    '$bidder.biddingStatus$': { [Op.lte]: 1 }
                },
                required : false , 
                separate : true,
                group: ['StoreId'],
                attributes: [
                    [Sequelize.fn('max', Sequelize.col('nominal')), 'bidder'], 
                    [Sequelize.fn('COUNT', 'id'), 'count']
                ], 
                order: [[Sequelize.literal('count'), 'DESC']],
                // raw: true,
                as: 'bidder'
            }, 
            {
                model: BiddingTransactions,
                on: {
                    '$Stores.id$': { [Op.col]: 'storeId' },
                    '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                },
                // required : false , 
                // separate : true,
                include: [  
                    { model: User }
                ]
            }
        ]
     }));
     console.log(err);
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores Detail', data:store}, 201);
}
module.exports.storeListDetail = storeListDetail;

const storeListLive = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores;
    [err, stores] = await to(Stores.findAll(
            { 
                where: {
                    startBid: {
                        [Op.lte]: new Date()
                    },
                    endBid: {
                        [Op.gte]: new Date()
                    },
                    userWinner: {
                        [Op.or]: [null, 0]
                    }

                },
                include: [ 
                    { 
                        model: Products,
                        include: [
                            {
                                model: Uploads,
                                as: 'productImages',
                                attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                                on: {
                                    '$Product.name$': { [Op.col]: 'content' },
                                    '$Product.id$': { [Op.col]: 'contentId' },
                                }
                            }
                        ]
                    }, 
                    {
                        model: BiddingTransactions,
                        on: {
                            '$Stores.id$': { [Op.col]: 'storeId' },
                            '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                        },
                        include: [
                            { model: User }
                        ]
                    }
                ]
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores List', data:stores}, 201);
}
module.exports.storeListLive = storeListLive;

const storeListWaiting = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores;

    [err, stores] = await to(Stores.findAll(
            { 
                where: {
                    userWinner: {
                        [Op.or]: [null, 0]
                    }
                },
                include: [ 
                    { 
                        model: Products,
                        include: [
                            {
                                model: Uploads,
                                as: 'productImages',
                                attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                                on: {
                                    '$Product.name$': { [Op.col]: 'content' },
                                    '$Product.id$': { [Op.col]: 'contentId' },
                                }
                            }
                        ]
                    }, 
                    {
                        model: BiddingTransactions,
                        on: {
                            '$Stores.id$': { [Op.col]: 'storeId' },
                            '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                        },
                        include: [
                            { model: User }
                        ]
                    }
                ]
            }, 
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores List', data:stores}, 201);
}
module.exports.storeListWaiting = storeListWaiting;

const storeListEnd = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores;
    [err, stores] = await to(Stores.findAll(
            { 
                where: {
                    [Op.or]: [
                        {
                            startBid: {
                                [Op.lt]: new Date()
                            },
                            endBid: {
                                [Op.lt]: new Date()
                            }
                        }, 
                        {
                            userWinner: {
                                [Op.or]: [
                                    {
                                        [Op.ne]: null
                                    },
                                    {
                                        [Op.ne]: 0
                                        
                                    }
                                ]
                            }
                        }
                        
                    ]
                },
                include: [ 
                    { 
                        model: Products,
                        include: [
                            {
                                model: Uploads,
                                as: 'productImages',
                                attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                                on: {
                                    '$Product.name$': { [Op.col]: 'content' },
                                    '$Product.id$': { [Op.col]: 'contentId' },
                                }
                            }
                        ]
                    }, 
                    {
                        model: BiddingTransactions,
                        on: {
                            '$Stores.id$': { [Op.col]: 'storeId' },
                            '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                        },
                        where: {
                            biddingStatus: {
                                [Op.not]: 2
                            }
                
                        },
                        include: [
                            { model: User }
                        ]
                    }
                ]
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores List End', data:stores}, 201);
}
module.exports.storeListEnd = storeListEnd;

const storeListUser = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores, user;
    user = req.user.dataValues;

    [err, stores] = await to(Stores.findAll(
            { include: [ 
                { 
                    model: Products,
                    include: [
                        {
                            model: Uploads,
                            as: 'productImages',
                            attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                            on: {
                                '$Product.name$': { [Op.col]: 'content' },
                                '$Product.id$': { [Op.col]: 'contentId' },
                            }
                        }
                    ]
                }, 
                {
                    model: BiddingTransactions,
                    required: true,
                    on: {
                        '$Stores.id$': { [Op.col]: 'storeId' },
                        '$BiddingTransactions.buyerId$': user.id,
                        '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                    },
                    include: [
                        { model: User }
                    ]
                }
            ]
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores List', data:stores}, 201);
}
module.exports.storeListUser = storeListUser;

const storeListLiveUser = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores, user;
    user = req.user.dataValues;
    [err, stores] = await to(Stores.findAll(
            { 
                where: {
                    startBid: {
                        [Op.lte]: new Date()
                    },
                    endBid: {
                        [Op.gte]: new Date()
                    },
                    userWinner: {
                        [Op.or]: [null, 0]
                    }
                },
                include: [ 
                    { 
                        model: Products,
                        include: [
                            {
                                model: Uploads,
                                as: 'productImages',
                                attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                                on: {
                                    '$Product.name$': { [Op.col]: 'content' },
                                    '$Product.id$': { [Op.col]: 'contentId' },
                                }
                            }
                        ]
                    }, 
                    {
                        model: BiddingTransactions,
                        required: true,
                        on: {
                            '$Stores.id$': { [Op.col]: 'storeId' },
                            '$bidder.buyerId$': user.id,
                            '$bidder.biddingStatus$': { [Op.lte]: 1 }
                        },
                        include: [
                            { model: User }
                        ],
                        as: 'bidder'
                    },
                    {
                        model: BiddingTransactions,
                        required : false, 
                        separate : true,
                        on: {
                            '$Stores.id$': { [Op.col]: 'storeId' },
                            '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                        },
                        include: [
                            { model: User }
                        ]
                    }
                ]
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores List', data:stores}, 201);
}
module.exports.storeListLiveUser = storeListLiveUser;

const storeListWaitingUser = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores, user;
    user = req.user.dataValues;

    [err, stores] = await to(Stores.findAll(
            { 
                where: {
                    // startBid: {
                    //     [Op.gte]: new Date()
                    // },
                    // endBid: {
                    //     [Op.gte]: new Date()
                    // },
                    userWinner: {
                        [Op.or]: [null, 0]
                    }
                },
                include: [ 
                    { 
                        model: Products,
                        include: [
                            {
                                model: Uploads,
                                as: 'productImages',
                                attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                                on: {
                                    '$Product.name$': { [Op.col]: 'content' },
                                    '$Product.id$': { [Op.col]: 'contentId' },
                                }
                            }
                        ]
                    }, 
                    {
                        model: BiddingTransactions,
                        required: true,
                        on: {
                            '$Stores.id$': { [Op.col]: 'storeId' },
                            '$BiddingTransactions.buyerId$': user.id,
                            '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                        },
                        include: [
                            { model: User }
                        ]
                    }
                ]
            }, 
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores List', data:stores}, 201);
}
module.exports.storeListWaitingUser = storeListWaitingUser;

const storeListEndUser = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores, user;
    user = req.user.dataValues;

    [err, stores] = await to(Stores.findAll(
            { 
                where: {
                    [Op.or]: [
                        {
                            startBid: {
                                [Op.lt]: new Date()
                            },
                            endBid: {
                                [Op.lt]: new Date()
                            }
                        }, 
                        {
                            userWinner: {
                                [Op.or]: [
                                    {
                                        [Op.ne]: null
                                    },
                                    {
                                        [Op.ne]: 0
                                        
                                    }
                                ]
                            }
                        }
                        
                    ]
                },
                include: [ 
                    { 
                        model: Products,
                        include: [
                            {
                                model: Uploads,
                                as: 'productImages',
                                attributes: [['id', 'prductImgId'],['type', 'prductImgType'],['content', 'productName'], ['contentId', 'productId'],['name', 'prductImgName'],'data'],
                                on: {
                                    '$Product.name$': { [Op.col]: 'content' },
                                    '$Product.id$': { [Op.col]: 'contentId' },
                                }
                            }
                        ]
                    }, 
                    {
                        model: BiddingTransactions,
                        required: true,
                        on: {
                            '$Stores.id$': { [Op.col]: 'storeId' },
                            '$BiddingTransactions.buyerId$': user.id,
                            '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 }
                        },
                        include: [
                            { model: User }
                        ]
                    }
                ]
            }, 
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Stores List End', data:stores}, 201);
}
module.exports.storeListEndUser = storeListEndUser;

const userBidlist = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, stores, user;
    user = req.user.dataValues;

    [err, stores] = await to(BiddingTransactions.findAll(
            {
                where: {
                    buyerId: user.id
                },
                order: [['updatedAt', 'DESC']],
                include: [
                    { 
                        model: Stores,
                        include: Products
                    }]
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Current User Bids List', data:stores}, 201);
}
module.exports.userBidlist = userBidlist;

const orderBid = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let ferr, currData, err, bids, bidData, store, key, keyUpdate, countbid, allbid;
    let user = req.user.dataValues;
    [countbid, allbid] = await to(BiddingTransactions.findAndCountAll({
        where: {
            productId: req.body.productId,
            storeId: req.body.storeId,
            biddingStatus: 1
        }
    }));
    [ferr, currData] = await to(BiddingTransactions.findOne({
        where: {
            productId: req.body.productId,
            storeId: req.body.storeId,
            buyerId: user.id
        }
    }))
    if(ferr) return ReE(res, ferr, 422);

    if(currData != null) return ReE(res, 'Sorry, You Had Followed Current Room');
    if(user.status != 1) return ReE(res, 'Sorry, You Were Blocked Or Not Verified By Admin. Please Contact Administrator', 403);
    
    bidData = {
        productId: req.body.productId,
        storeId: req.body.storeId,
        nominal: req.body.nominal,
        buyerId: user.id,
        paymentMethod: 0,
        paymentType: 0,
        paymentStatus: 0,
        paymentDate: null,
        shippingType: 0,
        shippingStatus: 0,
        paymentExpired: null
    };
    
    [err1, store] = await to(Stores.findOne({where: {id: req.body.storeId} }));
    if(err1) return ReE(res, err1, 422);
    if(store.maxbidder <= countbid) return ReE(res, { message: "Sorry The Room That You Want Bid was Full !" }, 406);
    [err2, key] = await to(KeyTransactions.findOne({where: {keyId: store.allowKey, useStatus: 0, buyerId: user.id} }));
    if(err2) return ReE(res, err2, 422);
    if(key == null ) return ReE(res, { message: "You Need requirement Key. Please Buy Requirement Key First !" }, 406);
    
    [err, bids] = await to(BiddingTransactions.create(bidData));
    if(err) return ReE(res, err, 422);
    
    [err3, keyUpdate] = await to(KeyTransactions.update(
        {useStatus : 1},
        {where: {id: key.id, buyerId: user.id} }
    ));
    if(err3) return ReE(res, err3, 422);
    if(store.allowKey == 3 ) {
        let mess = {
            to : user.fcm_reg_code,
            title : 'Gold Door Reserved',
            body : 'You already set for join the games, we will remind you 5 minutes before the game start. Don\'t miss it',
            datatype: "reservation",
            datadeeplink: "https://bidbong.com/notification?type=reservation"
    
        }
        let getFcmService =  fcmService.sendNotification(mess);
    }

    res.io.emit("usermakebid", bids);
    return ReS(res,{message: 'Success Create Bidding', data:bids}, 201);

}
module.exports.orderBid = orderBid;

const updateOrderBid = async function(req, res){
    let err, err2, bids, bidData, shipdata, shipdatas, shippingData, cekerr, cekbid;
    let user = req.user.dataValues;

    [cekerr, cekbid] = await to(BiddingTransactions.findOne({where: {id: req.body.id} }));
    console.log(cekbid);
    if(cekerr) return ReE(res, cekerr, 422);

    if(user.status != 1) return ReE(res, 'Sorry, You Were Blocked Or Not Verified By Admin. Please Contact Administrator', 406);
    if(cekbid == null) return ReE(res, 'No Data Order Bid Found', 422);
    if(cekbid.biddingStatus >= 2) return ReE(res, 'Sorry, You Have Been Left. Please Contact Administrator', 406);

    let ShipDetailId = 0;
    if(req.body.shippingType){
        shippingData = {
            userId : user.id,
            shippingType : req.body.shippingType,
            firstName : req.body.firstName,
            lastname : req.body.lastname,
            email : req.body.email,
            phoneNumber : req.body.phoneNumber,
            address : req.body.address,
            city : req.body.city,
            zipPostCode : req.body.zipPostCode,
            country : req.body.country,
            state : req.body.state
        };
        [err2, shipdata] = await to(ShippingDetails.findOne({ 
            where: {
                id: user.id
            }
        }));
        if(err2) return ReE(res, err2, 422);
        if(shipdata != null) {
            [err2, shipdatas] = await to(ShippingDetails.update(
                shippingData,
                {where: {id: shipdata.id} }
            ));
            if(err2) return ReE(res, err, 422);
            ShipDetailId = shipdatas.id;
        } else {
            [err2, shipdatas] = await to(ShippingDetails.create(
                shippingData
            ));
            if(err2) return ReE(res, err, 422);
            ShipDetailId = shipdatas.id;
        }
    }
    bidData = {
        productId: req.body.productId,
        storeId: req.body.storeId,
        nominal: req.body.nominal,
        buyerId: user.id,
        paymentMethod: (req.body.paymentMethod) ? req.body.paymentMethod : 0,
        paymentType: (req.body.paymentType) ? req.body.paymentType : 0,
        paymentStatus: (req.body.paymentStatus) ? req.body.paymentStatus : 0,
        paymentDate: (req.body.paymentStatus) ? req.body.paymentStatus : null,
        shippingType: (req.body.shippingType) ? req.body.shippingType : 0,
        shippingStatus: (req.body.shippingStatus) ? req.body.shippingStatus : 0,
        paymentExpired: (req.body.paymentExpired) ? req.body.paymentExpired : null,
        shippingDetailId: ShipDetailId
    };
    
    [err, bids] = await to(BiddingTransactions.update(
        bidData,
        {where: {id: req.body.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, bids] = await to(BiddingTransactions.findOne({where: {id: req.body.id} }));
    if(err) return ReE(res, err, 422);

    res.io.emit("userupdatebid", bids);

    return ReS(res,{message: 'Successfully Update Bid Transaction', data:bids}, 201);
}
module.exports.updateOrderBid = updateOrderBid;

const loadPayForm = async function (req, res) {
    let errbids, databids, errproduct, dataproduct;
    [errbids, databids] = await to(BiddingTransactions.findOne({where: {id: req.body.id} }));
    if(errbids) return ReE(res, errbids, 422);

    [errproduct, dataproduct] = await to(Products.findOne({where: {id: databids.productId} }));
    if(errproduct) return ReE(res, errproduct, 422);

    let datas = {
        id: databids.id,
        amount: dataproduct.price,
        currency: 'USD'
    }

    return ReS(res,{message: 'Form Payment Bidding Transaction', data:datas}, 201);
}
module.exports.loadPayForm = loadPayForm;

const payOrderBid = async function(req, res) {
    let err, payOrder, data, user, erruser, datauser, errship, dataship, errpay, datapay, pstatus;
    data = req.body;
    user = req.user.dataValues;

    [erruser, datauser] = await to(User.findOne({where: {id: user.id} }));
    if(erruser) return ReE(res, erruser, 422);

    [errship, dataship] = await to(ShippingDetails.findOne({ 
        where: {
            userId: user.id
        },
        order: [[ 'createdAt', 'DESC' ]]
    }));
    if(errship) return ReE(res, errship, 422);

    let paydata = {
        id: req.body.id,
        amount: req.body.amount,
        currency: req.body.currency,
        card_type: req.body.card_type,
        card_no: req.body.card_no,
        ccExpiryMonth: req.body.ccExpiryMonth,
        ccExpiryYear: req.body.ccExpiryYear,
        cvvNumber: req.body.cvvNumber,
        user: datauser,
        shipping: dataship
    }

    [errpay, datapay] = await to(iPayTotal.makePayment(paydata));
    if(errship) return ReE(res, errship, 422);

    if(datapay.status == 'fail') {
        return ReE(res, { message: datapay.message, data: datapay.errors }, 406);
    } else if(datapay.status == 'failed'){
        pstatus = 14
    } else {
        psattus = 12
    }

    //new code
    let sql = "UPDATE BiddingTransactions SET paymentMethod = 1,paymentType='"+req.body.card_type+"',paymentDate='"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"',updatedAt='"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"' WHERE id="+req.body.id;
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
        if(error){
            console.log(error);
        }else{
            // response.ok(rows,res)
            // res.io.emit("userupdatebid", payOrder);
            return ReS(res,{message: 'Successfully Update Bid Payment'}, 201);
        }
    });
    //

    // [err, payOrder] = await to(BiddingTransactions.update(
    //     {
    //         paymentMethod: 1,
    //         paymentType: req.body.card_type,
    //         payment_trxid: datapay.order_id,
    //         paymentStatus: pstatus,
    //         paymentDate: new Date()
    //     },
    //     {where: {id: req.body.id} }
    // ));
    // if(err) return ReE(res, err, 422);
    
    // res.io.emit("userupdatebid", payOrder);
    // return ReS(res,{message: 'Successfully Update Bid Payment', data:payOrder}, 201);

}
module.exports.payOrderBid = payOrderBid;

const LeaveRoom = async function (req, res) {
    let err, bids;
    let user = req.user.dataValues;
    [err, bids] = await to(BiddingTransactions.update(
        {biddingStatus : 2 },
        {
            where: {id: req.body.id}
        }
    ));
    if(err) return ReE(res, err, 422);
    res.io.emit("userleaveroom", bids);
    return ReS(res,{message: 'Successfully Left Bid Room', data:bids}, 201);
}
module.exports.LeaveRoom = LeaveRoom;
