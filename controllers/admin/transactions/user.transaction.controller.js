const { Stores, 
        Products, 
        User,  
        BiddingTransactions, 
        KeyTransactions, 
        ShippingDetails, 
        Uploads } = require('../../../models');

const { to, ReE, ReS } = require('../../../services/util.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const setAWinner = async function (req, res) {
        let err, store, data, errbids, bids, errbidUp, bidUp;
        data =  req.body;
        [errbids, bids] = await to(BiddingTransactions.findOne(
                {
                        where: {
                                buyerId: data.userId,
                                storeId: data.id
                        }
                }
        ));
        if(errbids) return ReE(res, errbids, 422);
        if( bids == null ) return ReE(res, 'No Bidding Transaction From User On Current Room', 422);

        [errbidUp, bidUp] = await to(BiddingTransactions.update(
                {
                        paymentStatus: 10
                },
                {
                        where: {
                                id: bids.id
                        }
                }
        ));
        if(errbidUp) return ReE(res, err, 422);
        if(bidUp[0] == 0) return ReE(res, 'No Bidding Data To Update', 422);

        [err, store] = await to(Stores.update(
                {
                        userWinner: data.userId,
                        setWinnerDate: new Date(),
                        setWinnerBy: req.user.dataValues.id
                },
                {
                        where: {
                                id: data.id,
                                userWinner: null
                        }
                },
        ));
        if(err) return ReE(res, err, 422);
        if(store[0] == 0) return ReE(res, 'No Room Winner Changed', 422);
        
        res.io.emit("setwinner", store);
        res.io.emit("setwinners", store);
        return ReS(res, {message:'Successfully Set Winner', data:store}, 201);
}

module.exports.setAWinner = setAWinner;

const changeAWinner = async function (req, res) {
        let err, store, data, errbids, bids, errbidUp, bidUp;
        data =  req.body;
        
        [errbids, bids] = await to(BiddingTransactions.findOne(
                {
                        where: {
                                buyerId: data.userId,
                                storeId: data.id,
                                biddingStatu: 1
                        }
                }
        ));
        if(errbids) return ReE(res, errbids, 422);
        if( bids == null ) return ReE(res, 'No Bidding Transaction From User On Current Room', 422);

        [errbidUp, bidUp] = await to(BiddingTransactions.update(
                {
                        paymentStatus: 10
                },
                {
                        where: {
                                id: bids.id
                        }
                }
        ));
        if(errbidUp) return ReE(res, err, 422);
        if(bidUp[0] == 0) return ReE(res, 'No Bidding Data To Update', 422);

        [err, store] = await to(Stores.update(
                {
                        userWinner: data.userId,
                        setWinnerDate: new Date(),
                        setWinnerBy: req.user.dataValues.id
                },
                {
                        where: {
                                id: data.id,
                                userWinner: {
                                        [Op.ne]: null
                                }
                        }
                },
        ));
        if(err) return ReE(res, err, 422);
        if(store[0] == 0) return ReE(res, 'No Room Winner Changed', 422);

        res.io.emit("changewinner", store);
        return ReS(res, {message:'Successfully Set Winner', data:store}, 201);
}
module.exports.changeAWinner = changeAWinner;

