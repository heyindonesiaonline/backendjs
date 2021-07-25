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

const newproductStartOnOneHour = async function (req, res) {
    var currDate = new Date();
    var nowDate = new Date();
    var oneHourBefore = new Date(currDate.setHours(currDate.getHours() - 1));
    let err, stores;
    console.log(nowDate);
    [err, stores] = await to(Stores.findAll(
        { 
            where: {
                startBid: {
                    [Op.between]: [oneHourBefore, nowDate]
                }
            }
        }
    ));
    if(err) return ReE(res, err, 422);
    if(stores == undefined || stores.length == 0) return  console.log('Data Not Found Or No Schedule');

    stores.forEach( async function(store, index, arr){

        let erruser, users;
        [erruser, users] = await to(BiddingTransactions.findAll({
            where: {
                storeId : store.id
            }
        }));
    
    
        let alluser = [];
        users.forEach( async function(user, index, arr){
            alluser.push(user.User.fcm_reg_code);
        });

        let errprod, getprod;
        [errprod, getprod] =  await to(
            Products.findOne(
                {
                    where: {
                        id: store.productId
                    }
                }
            )
        )
        if(getprod != null) {
            let mess = {
                to : alluser,
                title : 'Special Item\'s On Sale',
                body : getprod.name + ' is on sale. Get your seat to play now',
                datatype: "product",
                datadeeplink: "https://bidbong.com/notification?type=dashboard"
        
            }
            let getFcmService =  fcmService.sendNotificationAll(mess);
            console.log(getFcmService);
        }
    });
}

module.exports.newproductStartOnOneHour = newproductStartOnOneHour;

const newproductStartOn10Menuites = async function (req, res) {
    var currDate2 = new Date();
    var nowDate2 = new Date();
    var tenMinutesBefore = new Date(currDate2.setMinutes(currDate2.setMinutes() - 10));
    let err, stores;
    [err, stores] = await to(Stores.findAll(
        { 
            where: {
                startBid: {
                    [Op.between]: [tenMinutesBefore, nowDate2]
                }
            }
        }
    ));
    if(err) return ReE(res, err, 422);
    if(stores == undefined || stores.length == 0) return  console.log('Data Not Found Or No Schedule');

    stores.forEach( async function(store, index, arr){

        let erruser, users;
        [erruser, users] = await to(BiddingTransactions.findAll({
            where: {
                storeId : store.id
            }
        }));
    
    
        let alluser = [];
        users.forEach( async function(user, index, arr){
            alluser.push(user.User.fcm_reg_code);
        });

        let errprod, getprod;
        [errprod, getprod] =  await to(
            Products.findOne(
                {
                    where: {
                        id: store.productId
                    }
                }
            )
        )
        if(getprod != null) {
            let mess = {
                to : alluser,
                title : '5 Minutes Before The Games, ' + getprod.name,
                body : 'The game will start in 5 minutes. Prepare yourself to give yourbest price for this game',
                datatype: "product",
                datadeeplink: "https://bidbong.com/notification?type=dashboard"
        
            }
            let getFcmService =  fcmService.sendNotificationAll(mess);
            console.log(getFcmService);
        }
    });
}

module.exports.newproductStartOn10Menuites = newproductStartOn10Menuites;