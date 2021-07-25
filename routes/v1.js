const express         = require('express');
const router         = express.Router();

const UserController    = require('../controllers/admin/user.controller');
const UserData    = require('../controllers/users/profile.controller');
const userKetTrans    = require('../controllers/transactions/keys.controller');
const UserBid    = require('../controllers/transactions/bidding.controller');
const Dashboard    = require('../controllers/transactions/dashboard.controller');
const RoomDataController    = require('../controllers/transactions/stores.controller');
const ShippingtypesController = require('../controllers/admin/shippingtype.controller');

const listInboxNotRead = require('../controllers/notification/fcmnotify.controller');

const ResetPasword = require('../controllers/access/token.controller');

const iPayTotal = require('../services/ipaytotal');

const molliePay = require('../services/mollie.service');

const uploads    = require('../config/upload');

const passport          = require('passport');
const path              = require('path');

require('../middleware/passport')(passport);

router.post('/users', UserController.create);   
router.post( '/users/login', UserController.login);
router.get('/users/profile',passport.authenticate('users', {session:false}), UserData.get);
router.put('/users',passport.authenticate('users', {session:false}), UserController.update);
router.delete('/users',passport.authenticate('users',{session:false}), UserController.remove);

router.post('/users/reset/request', ResetPasword.requestReset);
router.post('/users/reset/check', ResetPasword.checkToken);
router.post('/users/reset/setpassword', ResetPasword.changePassword);

router.post('/users/update',passport.authenticate('users', {session:false}), uploads.any(), UserData.update);

router.get('/users/Key',passport.authenticate('users',{session:false}), userKetTrans.userKeyList);
router.get('/user/bid',passport.authenticate('users',{session:false}), UserBid.userBidlist);

router.get('/users/room/list',passport.authenticate('users',{session:false}), UserBid.storeListUser);
router.get('/users/room/live',passport.authenticate('users',{session:false}), UserBid.storeListLiveUser);
router.get('/users/room/waiting',passport.authenticate('users',{session:false}), UserBid.storeListWaitingUser);
router.get('/users/room/end',passport.authenticate('users',{session:false}), UserBid.storeListEndUser);
router.post('/users/room/leave',passport.authenticate('users',{session:false}), UserBid.LeaveRoom);

router.get('/users/room/have/winner', passport.authenticate('users',{session:false}), RoomDataController.ListRoomBidHasWinnerUser);
router.get('/users/shipping/type', passport.authenticate('users', {session:false}), ShippingtypesController.userListShippingType);

router.post('/order/Key',passport.authenticate('users',{session:false}), userKetTrans.orderKey);
router.post('/order/Key/pay',passport.authenticate('users',{session:false}), userKetTrans.payKey);
router.post('/order/Key/cancel',passport.authenticate('users',{session:false}), userKetTrans.cancelOrder);

router.post('/order/bidding',passport.authenticate('users',{session:false}), UserBid.orderBid);
router.put('/order/bidding/update',passport.authenticate('users',{session:false}), UserBid.updateOrderBid);

router.put('/order/bidding/payment',passport.authenticate('users',{session:false}), UserBid.payOrderBid);

router.get('/room/list',passport.authenticate('users',{session:false}), UserBid.storeList);
router.get('/room/detail/:id',passport.authenticate('users',{session:false}), RoomDataController.getDetailRoomAdmin);
router.get('/room/live',passport.authenticate('users',{session:false}), UserBid.storeListLive);
router.get('/room/waiting',passport.authenticate('users',{session:false}), UserBid.storeListWaiting);
router.get('/room/end',passport.authenticate('users',{session:false}), UserBid.storeListEnd);

router.get('/room/have/winner', passport.authenticate('users',{session:false}), RoomDataController.ListRoomBidHasWinner);

router.get('/key/list',passport.authenticate('users',{session:false}), userKetTrans.keyList);

router.get('/dashboard/counter',Dashboard.countData);
router.get('/dashboard/bidder',Dashboard.countDataBidder);
router.get('/dashboard/bidder/lastwinner',Dashboard.userDataBidderWinner);
router.get('/dashboard/bidder/bidderlist',Dashboard.userDataBidderList);

router.get('/shipping/type/:page', passport.authenticate('users', {session:false}), ShippingtypesController.getAll);
router.get('/shipping/type/search/:search', passport.authenticate('users', {session:false}), ShippingtypesController.searchST);


router.post('/payment/create', molliePay.createPayment);
router.get('/payment/method/list', molliePay.methodPayment);

router.get('/user/inbox/list', passport.authenticate('users', {session:false}), listInboxNotRead.listInboxNotRead);
router.post('/user/inbox/setread', passport.authenticate('users', {session:false}), listInboxNotRead.setHasbeenRead);

router.get('/payment/response/callback', iPayTotal.response3DSecure);
router.post('/payment/response/webhook', iPayTotal.webhookResponse);
router.post('/payment/get/detail', iPayTotal.detailPaymentTransaction);

router.post('/payment/test/makepayment', iPayTotal.makePaymentTest);


//new code
//Dashboard
router.post('/users/listDashboard',UserController.listDashboard);
module.exports = router;

//Rooms
router.post('/users/listRoom',UserController.listRoom);
module.exports = router;
//addroom
router.post('/users/addRoom',UserController.addRoom);
module.exports = router;
//detailroom
router.post('/users/detailRoom',UserController.detailRoom);
module.exports = router;
//update
router.post('/users/updateRoom',UserController.updateRoom);
module.exports = router;

//products
router.post('/users/listProducts',UserController.listProducts);
module.exports = router;
//add products
router.post('/users/addProducts',UserController.addProducts);
module.exports = router;
//detail products
router.post('/users/detailProducts',UserController.detailProducts);
module.exports = router;
//update products
router.post('/users/updateProducts',UserController.updateProducts);
module.exports = router;

//category
router.post('/users/listCategory',UserController.listCategory);
module.exports = router;
//addcategory
router.post('/users/addCategory',UserController.addCategory);
module.exports = router;
//detailcategory
router.post('/users/detailCategory',UserController.detailCategory);
module.exports = router;
//updateCategory
router.post('/users/updateCategory',UserController.updateCategory);
module.exports = router;

//Users
router.post('/users/listUser',UserController.listUser);
module.exports = router;
//detailuser
router.post('/users/detailUser',UserController.detailUser);
module.exports = router;
//updateUser
router.post('/users/updateUser',UserController.updateUser);
module.exports = router;

//Roles
router.post('/users/listRole',UserController.listRole);
module.exports = router;

//Keys
router.post('/users/listKey',UserController.listKey);
module.exports = router;
//detailkeys
router.post('/users/detailKey',UserController.detailKey);
module.exports = router;
//updatekeys
router.post('/users/updateKey',UserController.updateKey);
module.exports = router;

//Shipping
router.post('/users/listShipping',UserController.listShipping);
module.exports = router;
//add list shipping
router.post('/users/addlistShipping',UserController.addlistShipping);
module.exports = router;
//detail list shipping
router.post('/users/detailListShipping',UserController.detailListShipping);
module.exports = router;
//update shipping
router.post('/users/updateShipping',UserController.updateShipping);
module.exports = router;

//promotionkey
router.post('/users/listPromotion',UserController.listPromotion);
module.exports = router;
//detailpromotion
router.post('/users/detailPromotion',UserController.detailPromotion);
module.exports = router;
//updatepromotion
router.post('/users/addPromotion',UserController.addPromotion);
module.exports = router;
//updatepromotion
router.post('/users/updatePromotion',UserController.updatePromotion);
module.exports = router;

//getprofile
router.post('/users/getProfile',UserController.getProfile);
module.exports = router;
//updateProfile
router.post('/users/updateProfile',UserController.updateProfile);
module.exports = router;


//listTransactions
router.post('/users/listTransactions',UserController.listTransactions);
module.exports = router;
//listTransactionsPayment
router.post('/users/listTransactionsPayment',UserController.listTransactionsPayment);
module.exports = router;
//listTransactionsOrder
router.post('/users/listTransactionsOrder',UserController.listTransactionsOrder);
module.exports = router;
//listTransactionsDelivery
router.post('/users/listTransactionsDelivery',UserController.listTransactionsDelivery);
module.exports = router;
//updateTransactions
router.post('/users/updateTransactions',UserController.updateTransactions);
module.exports = router;
//detailTransactions
router.post('/users/detailTransactions',UserController.detailTransactions);
module.exports = router;

//listStatusTransactions
router.post('/users/listStatusTransactions',UserController.listStatusTransactions);
module.exports = router;

//listbidder
router.post('/users/listBidder',UserController.listBidder);
module.exports = router;

//ConfigEmail
router.post('/users/listConfigemail',UserController.listConfigemail);
module.exports = router;

router.post('/users/detailConfigemail',UserController.detailConfigemail);
module.exports = router;

router.post('/users/updateConfigemail',UserController.updateConfigemail);
module.exports = router;

router.post('/users/configEmail',UserController.configEmail);
module.exports = router;

//get info product to send email
router.post('/users/detailRoomSendEmail',UserController.detailRoomSendEmail);
module.exports = router;

//update set winner bid
router.post('/users/updateSetWinner',UserController.updateSetWinner);
module.exports = router;

//add rateapp
router.post('/users/addRate',UserController.addRate);
module.exports = router;

//get list rate app
router.post('/users/listRate',UserController.listRate);
module.exports = router;

//
router.post('/users/totalWin',UserController.totalWin);
module.exports = router;