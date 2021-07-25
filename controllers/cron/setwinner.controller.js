const { Stores, 
    Products, 
    User,  
    BiddingTransactions, 
    KeyTransactions, 
    ShippingDetails, 
    Uploads } = require('../../models');

const  fcmService = require('../../services/fcm.notification.services'); 
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const autoSetWinner = async function (req, res) {
    let err, stores;

    [err, stores] = await to(Stores.findAll(
        { 
            where: {
                [Op.and]: [
                    {
                        startBid: {
                            [Op.lte]: new Date()
                        },
                        endBid: {
                            [Op.gte]: new Date()
                        }
                    }, 
                    {
                        userWinner: {
                            [Op.or]: [
                                {
                                    [Op.is]: null
                                },
                                {
                                    [Op.is]: 0
                                    
                                }
                            ]
                        }
                    }
                    
                ]
            }
        }
    ));
    if(err) return ReE(res, err, 422);
    if(stores == null) return ReE(res, {message: 'No Store Found'}, 422); 
    
    stores.forEach( async function(store, index, arr){
        let errbidwinner, getbidwinner;
        [errbidwinner, getbidwinner] = await to(BiddingTransactions.findOne({
            where: {
                storeId: store.id,
                biddingStatus: 1
            },
            order: [
                ['nominal', 'DESC']
            ],
            limit: 1,
        }));
        if(getbidwinner != null) {
            let erruser, getuser;
            [erruser, getuser] = await to(User.findOne(
                    {
                        where: {
                            id: getbidwinner.buyerId
                        }
                    }
                )
            );
            let errupdate, getupdate;
            [errupdate, getupdate] = await to(Stores.update(
                {
                    userWinner: getbidwinner.buyerId,
                    setWinnerDate: new Date()
                },
                {
                    where: {
                        id: store.id
                    }
                }
            ));
            let errprod, getprod;
            [errprod, getprod] =  await to(
                Products.findOne(
                    {
                        where: {
                            id: getbidwinner.productid
                        }
                    }
                )
            )
            let mess = {
                to : getuser.fcm_reg_code,
                title : 'Wohoo, You Won For ' + getprod.name,
                body : 'Congratulations! Your Item has been added to the cart, checkout now to get the items!',
                datatype: "reminder",
                datadeeplink: "https://bidbong.com/notification?type=winner&room_id={" + store.id + "}"
        
            }
            let getFcmService =  fcmService.sendNotification(mess);
            console.log(getFcmService);
        }
    });
    console.log(stores);
}

module.exports.autoSetWinner = autoSetWinner;

const remindCompleteOrderOneHours = async function (req, res) {
    let err, stores;
    var currDate = new Date();
    [err, stores] = await to(Stores.findAll(
        { 
            where: {
                [Op.and]: [
                    {
                        startBid: {
                            [Op.lte]: new Date()
                        },
                        endBid: {
                            [Op.lte]: new Date()
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
                    },
                    {
                        setWinnerDate: {
                            [Op.lte]: new Date(currDate.setHours(currDate.getHours() + 1))
                        }
                    }
                ]
            }
        }
    ));

    if(err) return ReE(res, err, 422);
    if(stores == null) return ReE(res, {message: 'No Store Found'}, 422); 

    stores.forEach( async function(store, index, arr){
        let errbidwinner, getbidwinner;
        [errbidwinner, getbidwinner] = await to(BiddingTransactions.findOne({
            where: {
                storeId: store.id,
                buyerId: store.userWinner
            },
            include: [
                { model: User }
            ]
        }));
        if(getbidwinner != null) {
            let errprod, getprod;
            [errprod, getprod] =  await to(
                Products.findOne(
                    {
                        where: {
                            id: getbidwinner.productid
                        }
                    }
                )
            )
            let mess = {
                to : getbidwinner.User.fcm_reg_code,
                title : 'Complete Your Order',
                body : 'One More Step To Get The Item You Won - ' + getprod.name + '. You only have 1x24 hours before being given to the next winner',
                datatype: "reminder",
                datadeeplink: "https://bidbong.com/notification?type=winner&room_id={" + store.id + "}"
        
            }
            let getFcmService =  fcmService.sendNotification(mess);
            console.log(getFcmService);
        }
    });
    console.log(stores);

}

module.exports.remindCompleteOrderOneHours = remindCompleteOrderOneHours;

const remindCompleteOrderThreeHours = async function (req, res) {
    let err, stores;
    var currDate = new Date();
    [err, stores] = await to(Stores.findAll(
        { 
            where: {
                [Op.and]: [
                    {
                        startBid: {
                            [Op.lte]: new Date()
                        },
                        endBid: {
                            [Op.lte]: new Date()
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
                    },
                    {
                        setWinnerDate: {
                            [Op.lte]: new Date(currDate.setHours(currDate.getHours() + 3))
                        }
                    }
                ]
            }
        }
    ));
    stores.forEach( async function(store, index, arr){
        let errbidwinner, getbidwinner;
        [errbidwinner, getbidwinner] = await to(BiddingTransactions.findOne({
            where: {
                storeId: store.id,
                buyerId: store.userWinner
            },
            include: [
                { model: User }
            ]
        }));
        if(getbidwinner != null) {
            let errprod, getprod;
            [errprod, getprod] =  await to(
                Products.findOne(
                    {
                        where: {
                            id: getbidwinner.productid
                        }
                    }
                )
            )
            let mess = {
                to : getbidwinner.User.fcm_reg_code,
                title : 'Hurry Up, Complete Your Order',
                body : 'Pay Imediately and have the item you won before - ' + getprod.name + '. You only have 1x24 hours before being given to the next winner',
                datatype: "reminder",
                datadeeplink: "https://bidbong.com/notification?type=winner&room_id={" + store.id + "}"
        
            }
            let getFcmService =  fcmService.sendNotification(mess);
            console.log(getFcmService);
        }
    });
    console.log(stores);

}

module.exports.remindCompleteOrderThreeHours = remindCompleteOrderThreeHours;