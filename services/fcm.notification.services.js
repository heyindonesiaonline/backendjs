require('dotenv').config();

const FCM = require('fcm-node');
// const serverKey = process.env.FIREBASE_SK;
const serverKey = 'AAAAOlDvYH4:APA91bHJPjwGCnxc6OggslXTZ7Q_iVQExNHNbFFyUL3UHAsUxo-8tkzrtbkNDsvR-qr2BdE2e0sTJRieC_FVy-DhROY6QUS3Hi_OMI3M6eKwWWagTvtqL_l9oJGszn9iyLuqnSQA13Yd';


var fcm = new FCM(serverKey);

const { inbox_notifies } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const sendNotification = async function (reqData) {
    let errsave, succsave;
    let message = {
        to: reqData.to, 
        collapse_key: 'green',
        
        notification: {
            title: reqData.title, 
            body: reqData.body
        },
        data: {  
            my_key: reqData.datatype,
            my_another_key: reqData.datadeeplink
        }
    };

    if (typeof reqData.isLogin === 'undefined') {
        [errsave, succsave] = await to(inbox_notifies.create({
            fcm_code: reqData.to,
            title: reqData.title,
            body: reqData.body,
            type: reqData.datatype,
            deeplink: reqData.datadeeplink,
            read: 0,
            status: 1,
        }));
    }

    fcm.send(message, function(err, response){
        if (err) {
            console.log(err);
            return false;
        } else {
            console.log("Successfully sent with response: ", response);
            return true;
        }
    });
}

module.exports.sendNotification = sendNotification;

const sendNotificationAll = async function (reqData) {
    let getTo = reqData.to;
    for (let inM = 0; inM < getTo.length; inM++) {
        let errsave, succsave;
        let message = {
            to: getTo[inM], 
            collapse_key: 'green',
            
            notification: {
                title: reqData.title, 
                body: reqData.body
            },
            data: {  
                my_key: reqData.datatype,
                my_another_key: reqData.datadeeplink
            }
        };
    
        if (typeof reqData.isLogin === 'undefined') {
            [errsave, succsave] = await to(inbox_notifies.create({
                fcm_code: getTo[inM],
                title: reqData.title,
                body: reqData.body,
                type: reqData.datatype,
                deeplink: reqData.datadeeplink,
                read: 0,
                status: 1,
            }));
        }
    
        fcm.send(message, function(err, response){
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
        
    }
}

module.exports.sendNotificationAll = sendNotificationAll;