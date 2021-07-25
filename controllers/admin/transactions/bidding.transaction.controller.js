const { Stores, 
    Products, 
    User,  
    BiddingTransactions, 
    KeyTransactions, 
    ShippingDetails, 
    Uploads, StatusDesc } = require('../../../models');

const  fcmService = require('../../../services/fcm.notification.services'); 
const { to, ReE, ReS } = require('../../../services/util.service');
const mailer = require('../../../services/email.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const listNeedPaymentConfirmed = async function(req, res) {
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
                        attributes: [['content', 'productName'], ['contentId', 'productId']],
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
                    '$BiddingTransactions.biddingStatus$': { [Op.lte]: 1 },
                    '$BiddingTransactions.paymentStatus$': 12,
                    '$BiddingTransactions.biddingStatus$': 1,
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
module.exports.listNeedPaymentConfirmed = listNeedPaymentConfirmed;

const confirmAdminBidding = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let errSel, upBidTrans, errList, listStatus, data;
    data = req.body;
    [errSel, upBidTrans] = await to(BiddingTransactions.findOne(
        {
            where: {
                id: data.id
            }
        }
    ));
    if(errSel) return ReE(res, errSel, 422);
    [errList, listStatus] = await to(StatusDesc.findAll(
        {
            where: {
                statusCode: {
                    [Op.gte]: upBidTrans.paymentStatus
                }
            }
        }
    ));
    if(errList) return ReE(res, errList, 422);
    return ReS(res, {message:'Successfully Load Stores List', data:upBidTrans, list: listStatus}, 201);

}
module.exports.confirmAdminBidding = confirmAdminBidding;

const updateStatusBiddingAdmin = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, bids, errstat, statBid, data, geterr, getdata, messagedata, messagedes, ership, sucessship;

    [errstat, statBid] = await to(StatusDesc.findOne({where: {statusCode: req.body.status} }));

    if(errstat) return ReE(res, errstat, 422);

    if(statBid.statusType == 'payment') {
        messagedata = "Yeah, Your Payment Was Successful";
        messagedes = "Payment Was Successful. We will prepare your item for processing";
        data = {
            paymentStatus: req.body.status
        };
    } else if(statBid.statusType == 'order') {
        messagedata = "Order Confirmed";
        messagedes = "Order Confirmed";
        data = {
            paymentStatus: req.body.status
        };
    } else {
        messagedata = "Your Item Is On Deliver";
        messagedes = "Already send by courier to your address. Sit relaxed, enjoy your day!";
        [ership, sucessship] = await to(ShippingDetails.update(
            {
                tracking_code : req.body.tracking_code,
                courier_name : req.body.courier_name
            }, 
            {
                where : {
                    id: req.body.shippingDetailId
                }
            }
        ));
        data = {
            shippingStatus: req.body.status
        };
    }
    [err, bids] = await to(BiddingTransactions.update(
        data,
        {where: {id: req.body.id} }
    ));

    [geterr, getdata] = await to(BiddingTransactions.findOne(
        {
            where: {
                id: req.body.id
            },
            include: [
                {
                    model: User
                },
                {
                    model: Products
                },
                {
                    model: Stores
                }
            ]
        }
    ));

    if(geterr) return ReE(res, geterr, 422);

    console.log(getdata);

    if(req.body.status = 31) {
        sendmail = mailer.sendEmail('deliver-receipt', {
            subject: 'Delivery Shipping Detail',
            useremail: getdata.User.email,
            userfullname: getdata.User.first + " " + getdata.User.last,
            prodname: getdata.Product.name,
            prodprice: getdata.nominal,
            delireceipt: req.body.tracking_code,
            couriername : req.body.courier_name
          });
    }
    
    let mess = {
        to : getdata.User.fcm_reg_code,
        title : getdata.Product.name + ' ' + messagedata,
        body : messagedes,
        datatype: "reminder",
        datadeeplink: "https://bidbong.com/notification?type=winner&room_id={" + getdata.Store.id + "}"

    }
    let getFcmService =  fcmService.sendNotification(mess);
    console.log(getFcmService);

    res.io.emit("updateStatusBiddingAdmin", getdata);

    return ReS(res,{message: 'Successfully Update Bid Status Transaction', data:getdata}, 201);
}
module.exports.updateStatusBiddingAdmin = updateStatusBiddingAdmin;