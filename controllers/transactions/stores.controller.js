const { Stores, 
        Products, 
        User, 
        BiddingTransactions, 
        KeyTransactions, 
        ShippingDetails, 
        Uploads, 
        StatusDesc } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const ListRoomBidHasWinner = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, rooms;

    [err, rooms] = await to(Stores.findAll(
            {
                attributes: {
                    include: [
                        [Sequelize.col('Product.name'), 'product_name'],
                        [Sequelize.col('Product.price'), 'product_price'],
                        [Sequelize.col('winner.updatedAt'), 'last_update'],
                        [Sequelize.col('winner.nominal'), 'winner_price'],
                        [Sequelize.col('winner.payStatus.statusName'), 'payment_status'],
                        [Sequelize.col('winner.shipStatus.statusName'), 'last_status'],
                        [ Sequelize.literal('( SELECT IF (winner.shippingStatus != 0, winner.shippingStatus, winner.paymentStatus ) )'),'latest_status_code'],
                        [ Sequelize.literal('( SELECT IF (winner.shippingStatus != 0, last_status, payment_status ) )'),'latest_status_name']
                    ]
                },
                where: {
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
                        as: 'winner',
                        on: {
                            '$Stores.userWinner$': { [Op.col]: 'winner.buyerId' },
                        },
                        include: [
                            {
                                model: User,
                                on: {
                                    '$Stores.userWinner$': { [Op.col]: 'winner.User.id' },
                                },
                            },
                            {
                                model: StatusDesc,
                                as: 'payStatus',
                                attributes: [],
                                on: {
                                    '$winner.paymentStatus$': { [Op.col]: 'winner.payStatus.statusCode' },
                                },
                            },
                            {
                                model: StatusDesc,
                                as: 'shipStatus',
                                attributes: [],
                                on: {
                                    '$winner.shippingStatus$': { [Op.col]: 'winner.shipStatus.statusCode' },
                                },
                            }, 
                            {
                                model: ShippingDetails,
                            }
                        ]
                    },
                    {
                        model: BiddingTransactions,
                        as: 'listBidders',
                        include: [
                            {model: User}
                        ]
                    },
                ]
            }
        )
    );
    console.log(err);
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Current User Bids List', data:rooms}, 201);
}

module.exports.ListRoomBidHasWinner = ListRoomBidHasWinner;

const getDetailRoomAdmin = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, rooms;

    [err, rooms] = await to(Stores.findAll(
            {
                attributes: {
                    include: [
                        [Sequelize.col('Product.name'), 'product_name'],
                        [Sequelize.col('Product.price'), 'product_price'],
                        [Sequelize.col('winner.updatedAt'), 'last_update'],
                        [Sequelize.col('winner.nominal'), 'winner_price'],
                        [Sequelize.col('winner.payStatus.statusName'), 'payment_status'],
                        [Sequelize.col('winner.shipStatus.statusName'), 'last_status'],
                        [ Sequelize.literal('( SELECT IF (winner.shippingStatus != 0, winner.shippingStatus, winner.paymentStatus ) )'),'latest_status_code'],
                        [ Sequelize.literal('( SELECT IF (winner.shippingStatus != 0, last_status, payment_status ) )'),'latest_status_name']
                    ]
                },
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
                        as: 'winner',
                        on: {
                            '$Stores.userWinner$': { [Op.col]: 'winner.buyerId' },
                            '$Stores.id$': { [Op.col]: 'winner.storeId' },
                        },
                        include: [
                            {
                                model: User,
                                on: {
                                    '$Stores.userWinner$': { [Op.col]: 'winner.User.id' },
                                },
                            },
                            {
                                model: StatusDesc,
                                as: 'payStatus',
                                attributes: [],
                                on: {
                                    '$winner.paymentStatus$': { [Op.col]: 'winner.payStatus.statusCode' },
                                },
                            },
                            {
                                model: StatusDesc,
                                as: 'shipStatus',
                                attributes: [],
                                on: {
                                    '$winner.shippingStatus$': { [Op.col]: 'winner.shipStatus.statusCode' },
                                },
                            }, 
                            {
                                model: ShippingDetails,
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
                        as: 'listBidders',
                        include: [
                            {model: User}
                        ]
                    },
                ]
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Current User Bids Detail', data:rooms}, 201);
}

module.exports.getDetailRoomAdmin = getDetailRoomAdmin;

const ListRoomBidHasWinnerUser = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, rooms, user; 

    user = req.user.dataValues;

    [err, rooms] = await to(Stores.findAll(
            {
                attributes: {
                    include: [
                        [Sequelize.col('Product.name'), 'product_name'],
                        [Sequelize.col('Product.price'), 'product_price'],
                        [Sequelize.col('winner.updatedAt'), 'last_update'],
                        [Sequelize.col('winner.nominal'), 'winner_price'],
                        [Sequelize.col('winner.payStatus.statusName'), 'payment_status'],
                        [Sequelize.col('winner.shipStatus.statusName'), 'last_status'],
                        [ Sequelize.literal('( SELECT IF (winner.shippingStatus != 0, winner.shippingStatus, winner.paymentStatus ) )'),'latest_status_code'],
                        [ Sequelize.literal('( SELECT IF (winner.shippingStatus != 0, last_status, payment_status ) )'),'latest_status_name']
                    ]
                },
                where: {
                    userWinner: user.id
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
                        as: 'winner',
                        on: {
                            '$Stores.userWinner$': { [Op.col]: 'winner.buyerId' },
                            '$Stores.id$': { [Op.col]: 'winner.storeId' },
                        },
                        include: [
                            {
                                model: User,
                                on: {
                                    '$Stores.userWinner$': { [Op.col]: 'winner.User.id' },
                                },
                            },
                            {
                                model: StatusDesc,
                                as: 'payStatus',
                                attributes: [],
                                on: {
                                    '$winner.paymentStatus$': { [Op.col]: 'winner.payStatus.statusCode' },
                                },
                            },
                            {
                                model: StatusDesc,
                                as: 'shipStatus',
                                attributes: [],
                                on: {
                                    '$winner.shippingStatus$': { [Op.col]: 'winner.shipStatus.statusCode' },
                                },
                            },
                            {
                                model: ShippingDetails,
                            }
                        ]
                    },
                    {
                        model: BiddingTransactions,
                        as: 'listBidders',
                        include: [
                            {model: User}
                        ]
                    },
                ]
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Current User Bids List', data:rooms}, 201);
}

module.exports.ListRoomBidHasWinnerUser = ListRoomBidHasWinnerUser;