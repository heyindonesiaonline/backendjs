const express         = require('express');
const router         = express.Router();

const rolesController = require('../controllers/admin/roles.controller');
const categoriesController = require('../controllers/admin/categories.controller');
const emailsController = require('../controllers/admin/emails.controller');
const keysController = require('../controllers/admin/keys.controller');
const productController = require('../controllers/admin/products.controller');
const UserController    = require('../controllers/admin/user.controller');
const StoresController = require('../controllers/admin/stores.controller');
const ShippingtypesController = require('../controllers/admin/shippingtype.controller');
const AppSetting = require('../controllers/admin/appsetting.controller');
const TransBidUpdate = require('../controllers/admin/transactions/bidding.transaction.controller');
const UsertransactionDataUpdate = require('../controllers/admin/transactions/user.transaction.controller');
const CoreDataAdmin = require('../controllers/admin/transactions/core.transaction.controller');
const RoomDataController    = require('../controllers/transactions/stores.controller');

const custom            = require('./../middleware/custom');
const uploads    = require('../config/upload');

const passport          = require('passport');
const path              = require('path');

require('../middleware/passport')(passport);

/* 
 * Admin Route With Authentication
 * Will be validate If Role Is Admin
 */

// Roles CRUD

router.post('/apps', passport.authenticate('admin', {session:false}), uploads.any(), AppSetting.create); //create  
router.put('/apps', passport.authenticate('admin', {session:false}), uploads.any(), AppSetting.update); //update 

router.post('/users', passport.authenticate('admin', {session:false}), UserController.create); //create  
                                               
router.get('/users', passport.authenticate('admin', {session:false}), UserController.getAll);  //read

router.get('/users/:id', passport.authenticate('admin', {session:false}), UserController.get);  //read
     
router.put('/users', passport.authenticate('admin', {session:false}), UserController.update); //update
router.post('/users/block', passport.authenticate('admin', {session:false}), UserController.blockUser); //create  
   
router.delete('/users/:id', passport.authenticate('admin',{session:false}), UserController.remove); //delete

router.get('/roles', passport.authenticate('admin', {session:false}), rolesController.getAll);
router.post('/roles', passport.authenticate('admin', {session:false}), rolesController.create);

router.get('/roles/:id', passport.authenticate('admin', {session:false}), rolesController.get);
router.put('/roles', passport.authenticate('admin', {session:false}), rolesController.update);
router.delete('/roles/:id', passport.authenticate('admin', {session:false}), rolesController.remove);

// Categories CRUD

router.get('/categories', passport.authenticate('admin', {session:false}), categoriesController.getAll);
router.post('/categories', passport.authenticate('admin', {session:false}), categoriesController.create);

router.get('/categories/:id', passport.authenticate('admin', {session:false}), categoriesController.get);
router.put('/categories', passport.authenticate('admin', {session:false}), categoriesController.update);
router.delete('/categories/:id', passport.authenticate('admin', {session:false}), categoriesController.remove);

// Email CRUD

router.get('/emails', emailsController.getAll);
router.post('/emails', emailsController.create);

router.get('/emails/:id', emailsController.get);
router.put('/emails', emailsController.update);
router.delete('/emails/:id', emailsController.remove);

// Keys CRUD

router.get('/keys', passport.authenticate('admin', {session:false}), keysController.getAll);
router.post('/keys', passport.authenticate('admin', {session:false}), keysController.create);

router.get('/keys/:id', passport.authenticate('admin', {session:false}), keysController.get);
router.put('/keys', passport.authenticate('admin', {session:false}), keysController.update);
router.delete('/keys/:id', passport.authenticate('admin', {session:false}), keysController.remove);

// products CRUD

router.get('/product', passport.authenticate('admin', {session:false}), productController.getAll);
router.post('/product', passport.authenticate('admin', {session:false}), uploads.any(), productController.create);

router.get('/product/:id', passport.authenticate('admin', {session:false}), productController.get);
router.put('/product', passport.authenticate('admin', {session:false}), uploads.any(), productController.update);
router.delete('/product/:id', passport.authenticate('admin', {session:false}), productController.remove);


// stores CRUD

router.get('/stores', passport.authenticate('admin', {session:false}), StoresController.getAll);
router.post('/stores', passport.authenticate('admin', {session:false}), StoresController.create);

router.get('/stores/:id', passport.authenticate('admin', {session:false}), StoresController.get);
router.put('/stores', passport.authenticate('admin', {session:false}), StoresController.update);
router.delete('/stores/:id', passport.authenticate('admin', {session:false}), StoresController.remove);

router.post('/stores/winner/set', passport.authenticate('admin', {session:false}), UsertransactionDataUpdate.setAWinner);
router.post('/stores/winner/change', passport.authenticate('admin', {session:false}), UsertransactionDataUpdate.changeAWinner);

// shipping CRUD

router.get('/shipping/type/:page', passport.authenticate('admin', {session:false}), ShippingtypesController.getAll);
router.get('/shipping/type/search/:search', passport.authenticate('admin', {session:false}), ShippingtypesController.searchST);
router.post('/shipping/type', passport.authenticate('admin', {session:false}), ShippingtypesController.create);

router.get('/shipping/type/:id', passport.authenticate('admin', {session:false}), ShippingtypesController.get);
router.put('/shipping/type', passport.authenticate('admin', {session:false}), ShippingtypesController.update);
router.delete('/shipping/type/:id', passport.authenticate('admin', {session:false}), ShippingtypesController.remove);

// transaction admin update

router.get('/bidding/confirm/pay-list', passport.authenticate('admin', {session:false}), TransBidUpdate.listNeedPaymentConfirmed);
router.post('/bidding/confirm/status-list', passport.authenticate('admin', {session:false}), TransBidUpdate.confirmAdminBidding);
router.post('/bidding/confirm/update', passport.authenticate('admin', {session:false}), TransBidUpdate.updateStatusBiddingAdmin);

// Status admin Data
router.get('/status/data/list', passport.authenticate('admin', {session:false}), CoreDataAdmin.statusList);
router.get('/room/detail/:id', passport.authenticate('admin',{session:false}), RoomDataController.getDetailRoomAdmin);

module.exports = router;