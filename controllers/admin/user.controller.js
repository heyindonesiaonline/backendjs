const { User }          = require('../../models');
const authService       = require('../../services/auth.service');
const  fcmService       = require('../../services/fcm.notification.services'); 
const { to, ReE, ReS }  = require('../../services/util.service');

//new code
var response = require('../../response/res');
var connection = require('../../config/conn');
var nodemailer = require('nodemailer');
//

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;

    if(!body.unique_key && !body.email && !body.phone){
        return ReE(res, 'Please enter an email or phone number to register.');
    } else if(!body.password){
        return ReE(res, 'Please enter a password to register.');
    }else{
        let err, user;
        console.log(body);
        [err, user] = await to(authService.createUser(body));

        if(err) return ReE(res, err, 422);
        
        res.io.emit("newregistered", user);
        //new code free key
        let sql_key = "SELECT * FROM PromotionKey pk WHERE pk.status = 1 AND pk.pageid = 1 AND DATE(NOW()) BETWEEN DATE(pk.valid_from) AND DATE(pk.valid_to) LIMIT 1";
        console.log(sql_key);
        connection.query(sql_key,function(error,rows,fields){
        if(rows.length === 0){
            console.log(error);
            console.log("no free keys");
        }else{
            var data_json = JSON.stringify(rows);
            result = data_json.replace(/(^\[)/,'');
            result = result.replace(/(\]$)/,'');
            obj = JSON.parse(result);
            var key_id = obj.key_id;
            var amount_key = obj.amount;

            console.log(key_id);
            console.log(amount_key)

            //get info user
            connection.query("SELECT * FROM Users WHERE email = ?",[body.email],
            function (error,rows,fields){
                if(rows.length === 0){
                    console.log("empty")
                    console.log("error")
                }else{
                    var data_json = JSON.stringify(rows) 
                    result = data_json.replace(/(^\[)/, '');
                    result =  result.replace(/(\]$)/, '');
                    obj = JSON.parse(result);
                    var user_id = obj.id;
                    var payment_method = 2;
                    var payment_type = 1;
                    var payment_status = 12;
                    var payment_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    var payment_expired = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    var create_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    var update_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    var use_status = 0;
                    var payment_trxid = null;
                    var ipayment_desc = null;
                    var ipayment_status = null;
                    //insert new key
                    let sql_insert_key = "INSERT INTO KeyTransactions (keyId, buyerId, paymentMethod,paymentType,paymentStatus,paymentDate,paymentExpired,createdAt,updatedAt,useStatus,payment_trxid,ipayment_desc,ipayment_status) VALUES ('"+key_id+"','"+user_id+"','"+payment_method+"','"+payment_type+"','"+payment_status+"','"+payment_date+"','"+payment_expired+"','"+create_at+"','"+update_at+"','"+use_status+"','"+payment_trxid+"','"+ipayment_desc+"','"+ipayment_status+"')";
                    console.log(sql_insert_key);
                    connection.query(sql_insert_key,function(error,rows,
                        fields){
                            if(error){
                                console.log(error);
                            }else{
                                console.log('success free key');
                            }
                        });
                    //end insert new key
                }
            });
            //

            
        }
        });
        //
        return ReS(res, {
            message:'Successfully created new user.', 
            user:user.toWeb(), 
            token:user.getJWT()}, 
            201
            );
    }
}
module.exports.create = create;

const get = async function(req, res){
    // console.log("disini param" +req.params.user_id);
    res.setHeader('Content-Type', 'application/json');
    // let user = req.user;
    let err, users;

    [err, users] = await to(User.findOne({
        where: {
          id: req.params.id
        }
      }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Detail Users', data:users}, 201);
}
module.exports.get = get;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, users;

    [err, users] = await to(User.findAll());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Users List', data:users}, 201);
}
module.exports.getAll = getAll;

const update = async function(req, res){

    let err, user, data;
    data = req.body;

    [err, user] = await to(User.update(
        data,
        {where: {id: data.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, user] = await to(User.findOne({where: {id: data.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Update Detail Users', data:user}, 201);
}
module.exports.update = update;

const blockUser = async function(req, res){

    let err, user, data;
    data = req.body;

    [err, user] = await to(User.update(
        {status: 2},
        {where: {id: data.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, user] = await to(User.findOne({where: {id: data.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'The Select User Have Been Blocked', data:user}, 201);
}
module.exports.blockUser = blockUser;

const remove = async function(req, res){
    let user, err;

    [err, user] = await to(User.destroy({
        where: {
          id: req.params.id
        }
      }));
      if(err) return ReE(res, err, 422);

    if(err) return ReE(res, 'error occured trying to delete the User');

    return ReS(res, {message:'Successfully Delete User', data:user}, 201);
}
module.exports.remove = remove;

const login = async function(req, res){
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);
    res.io.emit("login", user);
    if(user.fcm_reg_code === "" || user.fcm_reg_code === "0" ||  user.fcm_reg_code === null || user.fcm_reg_code != req.body.fcm_reg_code) {
        user.set(
            {
                fcm_reg_code: req.body.fcm_reg_code
            }
        )
        [err, user] = await to(user.save());
        if(err) return ReE(res, err, 422);
    }
    let mess = {
        to : user.fcm_reg_code,
        title : 'A user has been login',
        body : user.first + ' ' + user.last + ' has been login',
        isLogin: "true"

    }
    let getFcmService =  fcmService.sendNotification(mess);
    
    console.log(getFcmService);

    if(getFcmService == false ) return ReE(res, 'error occured trying to send nitification');

    return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;


//new code
//Dashboard
const listDashboard = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT (SELECT count(usr.id) AS total_users FROM Users usr) AS total_users, (SELECT count(bds.id) AS total_users FROM BiddingTransactions bds) AS total_bids, (SELECT count(str.id) AS total_users FROM Stores str) AS total_rooms",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};

module.exports.listDashboard = listDashboard;

//category
const listCategory = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT * FROM Categories ORDER BY id DESC",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listCategory = listCategory;
//add category
const addCategory = async function(req,res){
    // var userid = req.body.userid;
    var name = req.body.name;
    var description = req.body.description;
    var status = 1;

    let sql = "INSERT INTO Categories (name, description, status) VALUES ('"+name+"','"+description+"','"+status+"')";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.addCategory = addCategory;
//detail category
const detailCategory = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT * FROM Categories WHERE md5(id) = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailCategory = detailCategory;

//updatecategory
const updateCategory = async function(req,res){
    // var userid = req.body.userid;
    var id = req.body.id;

    var name = req.body.name;
    var description = req.body.description;
    var status = req.body.status;
    var updatedAt = req.body.updatedAt;

    let sql = "UPDATE Categories SET name='"+name+"',description='"+description+"',status='"+status+"',updatedAt='"+updatedAt+"' WHERE md5(id)='"+id+"'";
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateCategory = updateCategory;

//room
const listRoom = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT str.id,prd.name AS product_name,ky.name AS keys_name,str.startBid,str.endBid,usr.first,str.createdAt FROM Stores str INNER JOIN Products prd ON str.productId = prd.id INNER JOIN `Keys` ky ON str.allowKey = ky.id LEFT JOIN Users usr ON str.userWinner = usr.id",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listRoom = listRoom;
//add room
const addRoom = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;

    var productId = req.body.productId;
    var allowKey = req.body.allowKey;
    var startBid = req.body.startBid;
    var endBid = req.body.endBid;
    var setWinnerDate = req.body.setWinnerDate;
    var maxxBidder = req.body.maxxBidder;
    var createdAt = req.body.createdAt;

    let sql = "INSERT INTO Stores (productId, allowKey, startBid, endBid, setWinnerDate,maxBidder,createdAt) VALUES ('"+productId+"','"+allowKey+"','"+startBid+"','"+endBid+"','"+setWinnerDate+"','"+maxxBidder+"','"+createdAt+"')";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.addRoom = addRoom;
//detail room
const detailRoom = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT str.id,str.productId,prd.name AS productName,str.allowKey,ky.name AS keyName,str.startBid,str.endBid,str.setWinnerDate,str.maxBidder FROM Stores str INNER JOIN Products prd ON str.productId = prd.id INNER JOIN `Keys` ky ON str.allowKey = ky.id WHERE md5(str.id) = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailRoom = detailRoom;
//update room
const updateRoom = async function(req,res){
    
    var id = req.body.id;
    var productId = req.body.productId;
    var allowKey = req.body.allowKey;
    var startBid = req.body.startBid;
    var endBid = req.body.endBid;
    var setWinnerDate = req.body.setWinnerDate;
    var maxBidder = req.body.maxBidder;
    var updatedAt = req.body.updatedAt;

    let sql = "UPDATE Stores SET productId='"+productId+"',allowKey='"+allowKey+"',startBid='"+startBid+"',endBid='"+endBid+"',setWinnerDate='"+setWinnerDate+"',maxBidder='"+maxBidder+"',updatedAt='"+updatedAt+"' WHERE md5(id)='"+id+"'";
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateRoom = updateRoom;
//
//products
const listProducts = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT pr.id,pr.name,pr.categoryId,pr.description,pr.price,pr.images,pr.images1,pr.images2,pr.images3,pr.status,pr.createdAt,pr.updatedAt,ct.name AS categoryName FROM Products pr INNER JOIN Categories ct ON ct.id = pr.categoryId ORDER BY pr.id DESC",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};

module.exports.listProducts = listProducts;
//add products
const addProducts = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;

    var name = req.body.name;
    var categoryId = req.body.categoryId;
    var description = req.body.description;
    var price = req.body.price;
    var images = req.body.images;
    var images1 = req.body.images1;
    var images2 = req.body.images2;
    var images3 = req.body.images3;
    var createdAt = req.body.createdAt;

    var typeimage = req.body.typeimage;
    var sizeimage = req.body.sizeimage;

    let sql = "INSERT INTO Products (name, categoryId, description, price, images, images1,images2,images3,createdAt,status) VALUES ('"+name+"','"+categoryId+"','"+description+"','"+price+"','"+images+"','"+images1+"','"+images2+"','"+images3+"','"+createdAt+"',1)";
    
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                var insertId = rows.insertId;
                let sql_insert = "INSERT INTO Uploads (content, contentId, type, name, data, createdAt) VALUES ('"+name+"','"+insertId+"','"+typeimage+"','"+images+"','"+sizeimage+"','"+createdAt+"'),('"+name+"','"+insertId+"','"+typeimage+"','"+images1+"','"+sizeimage+"','"+createdAt+"'),('"+name+"','"+insertId+"','"+typeimage+"','"+images2+"','"+sizeimage+"','"+createdAt+"'),('"+name+"','"+insertId+"','"+typeimage+"','"+images3+"','"+sizeimage+"','"+createdAt+"')";
                console.log(sql_insert);
                connection.query(sql_insert,function(error,rows,
                    fields){
                        if(error){
                            console.log(error);
                        }else{
                            response.ok(rows,res)
                        }
                    });
            }
        });
};
module.exports.addProducts = addProducts;
//detail products
const detailProducts = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT pr.id,pr.name,pr.categoryId,pr.description,pr.price,pr.images,pr.images1,pr.images2,pr.images3,pr.status,pr.createdAt,pr.updatedAt,ct.name AS categoryName FROM Products pr INNER JOIN Categories ct ON ct.id = pr.categoryId WHERE md5(pr.id) = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailProducts = detailProducts;
//update products
const updateProducts = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;

    var name = req.body.name;
    var description = req.body.description;
    var categoryId = req.body.categoryId;
    var price = req.body.price;
    var images = req.body.images;
    var images1 = req.body.images1;
    var images2 = req.body.images2;
    var images3 = req.body.images3;
    var status = req.body.status;
    var updatedAt = req.body.updatedAt;

    let sql = "UPDATE Products SET name='"+name+"',description='"+description+"',categoryId='"+categoryId+"',price='"+price+"',images='"+images+"',images1='"+images1+"',images2='"+images2+"',images3='"+images3+"',status='"+status+"',updatedAt='"+updatedAt+"' WHERE md5(id)='"+id+"'";
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                // response.ok(rows,res)
                let sql_update = "UPDATE Uploads SET content='"+name+"',name='"+images+"',updatedAt='"+updatedAt+"' WHERE md5(contentId)='"+id+"'";
                connection.query(sql_update,function(error,rows,
                    fields){
                        if(error){
                            console.log(error);
                        }else{
                            response.ok(rows,res)
                        }
                    });
            }
        });
};
module.exports.updateProducts = updateProducts;
//end products

//users
const listUser = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT usr.id,usr.first,usr.last,usr.email,usr.phone,rl.name AS role_name,usr.roleId As role_id,usr.status FROM Users usr INNER JOIN Roles rl ON usr.roleId = rl.id",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listUser = listUser;


//getsingleuser
const detailUser = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT usr.id,usr.first,usr.last,usr.email,usr.phone,usr.address,usr.city,usr.zipcode,usr.state,usr.country,usr.birthdate,usr.roleId AS role_id,rl.name AS role_name,usr.status FROM Users usr INNER JOIN Roles rl ON rl.id = usr.roleId WHERE usr.id = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailUser = detailUser;

//updateuser
const updateUser = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;

    var first = req.body.first;
    var last = req.body.last;
    // var birthdate = req.body.birthdate;
    var phone = req.body.phone;
    var email = req.body.email;
    var address = req.body.address;
    var city = req.body.city;
    var zipcode = req.body.zipcode;
    var state = req.body.state;
    var country = req.body.country;
    var role_id = req.body.role_id;
    var status = req.body.status;

    let sql = "UPDATE Users SET first='"+first+"',last='"+last+"',phone='"+phone+"',email='"+email+"',address='"+address+"',city='"+city+"',zipcode='"+zipcode+"',state='"+state+"',country='"+country+"',status='"+status+"' WHERE id="+id;
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateUser = updateUser;


//roles
const listRole = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT * FROM Roles",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};

module.exports.listRole = listRole;

//keys
const listKey = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT id,name,description,price AS price_normal,discount,price - (price * (discount/100)) AS price,status,disc_valid_from,disc_valid_to,createdAt,updatedAt FROM `Keys`",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listKey = listKey;
//getsinglekeys
const detailKey = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT * FROM `Keys` WHERE id = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailKey = detailKey;
//updatekeys
const updateKey = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;

    var name = req.body.name;
    var description = req.body.description;
    var discount = req.body.discount;
    var price = req.body.price;
    var disc_valid_from = req.body.disc_valid_from;
    var disc_valid_to = req.body.disc_valid_to;
    var status = req.body.status;

    let sql = "UPDATE `Keys` SET name='"+name+"',description='"+description+"',discount='"+discount+"',price='"+price+"',status='"+status+"',disc_valid_from='"+disc_valid_from+"',disc_valid_to='"+disc_valid_to+"' WHERE id="+id;
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateKey = updateKey;


//shipping
const listShipping = async function(req,res){
    var userid = req.body.userid;
    // let sql = "SELECT sd.id, usr.email, sd.firstName, sd.lastname, sd.email, sd.phoneNumber, sd.address, sd.city, sd.city, sd.zipPostCode, sd.zipPostCode, sd.country, sd.createdAt FROM ShippingDetails sd INNER JOIN ShippingTypes st ON sd.shippingType = st.id INNER JOIN Users usr ON usr.id = sd.userId ORDER BY sd.id DESC";
    let sql = "SELECT * FROM ShippingTypes"
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listShipping = listShipping;
//add list shipping
const addlistShipping = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;

    var shippingCode = req.body.shippingCode;
    var shippingName = req.body.shippingName;
    var shippingDescription = req.body.shippingDescription;
    var price = req.body.price;
    var country = req.body.country;
    var state = req.body.state;
    var estimate = req.body.estimate;
    var createdAt = req.body.createdAt;

    let sql = "INSERT INTO ShippingTypes (shippingCode, shippingName, shippingDescription, price, country, state, estimate, createdAt) VALUES ('"+shippingCode+"','"+shippingName+"','"+shippingDescription+"','"+price+"','"+country+"','"+state+"','"+estimate+"','"+createdAt+"')";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.addlistShipping = addlistShipping;
//detail shippingtype
const detailListShipping = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT * FROM ShippingTypes WHERE md5(id) = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailListShipping = detailListShipping;
//update shippingtype
const updateShipping = async function(req,res){
    var userid = req.body.userid;
    var id_shipping = req.body.id;
    // console.log(id);
    var shippingCode = req.body.shippingCode;
    var shippingName = req.body.shippingName;
    var shippingDescription = req.body.shippingDescription;
    var price = req.body.price;
    var country = req.body.country;
    var estimate = req.body.estimate;
    var state = req.body.state;
    var updatedAt = req.body.updatedAt;

    let sql = "UPDATE ShippingTypes SET shippingCode='"+shippingCode+"',shippingName='"+shippingName+"',shippingDescription='"+shippingDescription+"',price='"+price+"',country='"+country+"',estimate='"+estimate+"',state='"+state+"',updatedAt='"+updatedAt+"' WHERE md5(id)='"+id_shipping+"'";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateShipping = updateShipping;


///

//promotionkey
const listPromotion = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT pk.id,pk.title_promo,pk.desc_promo,pk.amount,pg.title_page,DATE_FORMAT(pk.valid_from,'%Y-%m-%d') AS valid_from,DATE_FORMAT(pk.valid_to,'%Y-%m-%d') AS valid_to,pk.status,ky.name AS key_name FROM PromotionKey pk INNER JOIN Page pg ON pg.id = pk.pageid INNER JOIN `Keys` ky ON ky.id = pk.key_id ORDER BY pk.id DESC",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listPromotion = listPromotion;

//getsinglepromotionkey
const detailPromotion = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT pk.id,pk.title_promo,pk.desc_promo,pk.amount,pk.status,DATE_FORMAT(pk.valid_from,'%Y-%m-%d') AS valid_from,DATE_FORMAT(pk.valid_to,'%Y-%m-%d') AS valid_to,pk.key_id,ky.name AS key_name FROM PromotionKey pk INNER JOIN `Keys` ky ON ky.id = pk.key_id  WHERE pk.id = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailPromotion = detailPromotion;
//update promotionkey
const updatePromotion = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    console.log(id)
    var title_promo = req.body.title_promo;
    var desc_promo = req.body.desc_promo;
    var key_id = req.body.key_id;
    var amount = req.body.amount;
    var valid_from = req.body.valid_from;
    var valid_to = req.body.valid_to;
    var status = req.body.status;

    let sql = "UPDATE PromotionKey SET title_promo='"+title_promo+"',desc_promo='"+desc_promo+"',amount='"+amount+"',valid_from='"+valid_from+"',valid_to='"+valid_to+"',status='"+status+"',key_id='"+key_id+"' WHERE id='"+id+"'";
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updatePromotion = updatePromotion;
//add promotion
const addPromotion = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;

    var title_promo = req.body.title_promo;
    var desc_promo = req.body.desc_promo;
    var key_id = req.body.key_id;
    var amount = req.body.amount;
    var valid_from = req.body.valid_from;
    var valid_to = req.body.valid_to;

    let sql = "INSERT INTO PromotionKey (title_promo, desc_promo,key_id, amount, valid_from, valid_to,pageid) VALUES ('"+title_promo+"','"+desc_promo+"','"+key_id+"','"+amount+"','"+valid_from+"','"+valid_to+"',1)";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.addPromotion = addPromotion;

//getprofil
const getProfile = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT * FROM Users usr WHERE usr.id = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.getProfile = getProfile;
//update profile
const updateProfile = async function(req,res){
    // var userid = req.body.userid;
    var id = req.body.id;

    var first = req.body.first;
    var last = req.body.last;
    var phone = req.body.phone;
    var address = req.body.address;
    var city = req.body.city;
    var zipcode = req.body.zipcode;
    var state = req.body.state;
    var country = req.body.country;
    var birthdate = req.body.birthdate;

    let sql = "UPDATE Users SET first='"+first+"',last='"+last+"',phone='"+phone+"',address='"+address+"',city='"+city+"',zipcode='"+zipcode+"',state='"+state+"',country='"+country+"',birthdate='"+birthdate+"' WHERE id='"+id+"'";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateProfile = updateProfile;

//listTransactions
const listTransactions = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT bt.id, usr.first, usr.last, pr.name AS product_name, sts.statusName, DATE_FORMAT(bt.paymentDate,'%Y-%m-%d') AS payment_date, bt.nominal, DATE_FORMAT(bt.createdAt,'%Y-%m-%d') AS createdAt FROM BiddingTransactions bt INNER JOIN Stores st ON bt.storeId = st.id INNER JOIN Products pr ON bt.productId = pr.id INNER JOIN Users usr ON bt.buyerId = usr.id LEFT JOIN StatusDescs sts ON bt.paymentStatus = sts.statusCode ORDER BY bt.id DESC",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listTransactions = listTransactions;
//listTransactionsPayment
const listTransactionsPayment = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT bt.id, usr.first, usr.last, pr.name AS product_name, sts.statusName, DATE_FORMAT(bt.paymentDate,'%Y-%m-%d') AS payment_date, bt.nominal, DATE_FORMAT(bt.createdAt,'%Y-%m-%d') AS createdAt FROM BiddingTransactions bt INNER JOIN Stores st ON bt.storeId = st.id INNER JOIN Products pr ON bt.productId = pr.id INNER JOIN Users usr ON bt.buyerId = usr.id LEFT JOIN StatusDescs sts ON bt.paymentStatus = sts.statusCode WHERE sts.statusType = 'payment' ORDER BY bt.id DESC",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listTransactionsPayment = listTransactionsPayment;
//listTransactionsOrder
const listTransactionsOrder = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT bt.id, usr.first, usr.last, pr.name AS product_name, sts.statusName, DATE_FORMAT(bt.paymentDate,'%Y-%m-%d') AS payment_date, bt.nominal, DATE_FORMAT(bt.createdAt,'%Y-%m-%d') AS createdAt FROM BiddingTransactions bt INNER JOIN Stores st ON bt.storeId = st.id INNER JOIN Products pr ON bt.productId = pr.id INNER JOIN Users usr ON bt.buyerId = usr.id LEFT JOIN StatusDescs sts ON bt.paymentStatus = sts.statusCode WHERE sts.statusType = 'order' ORDER BY bt.id DESC",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listTransactionsOrder = listTransactionsOrder;
//listTransactionsDelivery
const listTransactionsDelivery = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT bt.id, usr.first, usr.last, pr.name AS product_name, sts.statusName, DATE_FORMAT(bt.paymentDate,'%Y-%m-%d') AS payment_date, bt.nominal, DATE_FORMAT(bt.createdAt,'%Y-%m-%d') AS createdAt FROM BiddingTransactions bt INNER JOIN Stores st ON bt.storeId = st.id INNER JOIN Products pr ON bt.productId = pr.id INNER JOIN Users usr ON bt.buyerId = usr.id LEFT JOIN StatusDescs sts ON bt.paymentStatus = sts.statusCode WHERE sts.statusType = 'delivery' ORDER BY bt.id DESC",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listTransactionsDelivery = listTransactionsDelivery;
//updateTransactions
const updateTransactions = async function(req,res){
    // var userid = req.body.userid;
    var id = req.body.id;
    var paymentStatus = req.body.paymentStatus;
    var updatedAt = req.body.updatedAt;

    let sql = "UPDATE BiddingTransactions SET paymentStatus='"+paymentStatus+"',updatedAt='"+updatedAt+"' WHERE id='"+id+"'";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateTransactions = updateTransactions;
//getsinglepromotionkey
const detailTransactions = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT bt.id, bt.storeId, usr.first, usr.last, pr.name AS product_name, sts.statusName AS status_name, sts.statusCode AS status_code, DATE_FORMAT(bt.paymentDate,'%Y-%m-%d') AS payment_date, bt.nominal, DATE_FORMAT(bt.createdAt,'%Y-%m-%d') AS createdAt FROM BiddingTransactions bt INNER JOIN Stores st ON bt.storeId = st.id INNER JOIN Products pr ON bt.productId = pr.id INNER JOIN Users usr ON bt.buyerId = usr.id LEFT JOIN StatusDescs sts ON bt.paymentStatus = sts.statusCode WHERE bt.id = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailTransactions = detailTransactions;

//listStatusTransactions
const listStatusTransactions = async function(req,res){
    connection.query("SELECT * FROM StatusDescs",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listStatusTransactions = listStatusTransactions;


//listBidder
const listBidder = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT bt.id,bt.BuyerId,usr.first,usr.last,bt.nominal FROM BiddingTransactions bt INNER JOIN Stores st ON bt.storeId = st.id INNER JOIN Users usr ON usr.id = bt.buyerId WHERE md5(st.id) = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listBidder = listBidder;


//configemail
const listConfigemail = async function(req,res){
    var userid = req.body.userid;
    connection.query("SELECT * FROM ConfigEmail",function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.listConfigemail = listConfigemail;

const detailConfigemail = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT * FROM ConfigEmail WHERE md5(Id) = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.detailConfigemail = detailConfigemail;

const updateConfigemail = async function(req,res){
    var id = req.body.id;
    var Host = req.body.Host;
    var User = req.body.User;
    var Pass = req.body.Pass;
    var Port = req.body.Port;

    let sql = "UPDATE ConfigEmail SET Host='"+Host+"',User='"+User+"',Pass='"+Pass+"',Port='"+Port+"' WHERE md5(id)='"+id+"'";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateConfigemail = updateConfigemail;

//email
const configEmail = async function(req,res){
    var userid = req.body.userid;
    var id = 1;
    connection.query("SELECT * FROM ConfigEmail WHERE id = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.configEmail = configEmail;

//detailroom action setwinner
const detailRoomSendEmail = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    
    let sql = "SELECT str.id, str.productId, prd.name AS productName, str.allowKey, str.startBid, str.endBid, str.setWinnerDate, str.maxBidder, usr.email, usr.first, bt.nominal, prd.images, bt.paymentDate, bt.payment_trxid, shd.tracking_code, shd.courier_name, sht.shippingCode, sht.shippingName, sht.shippingDescription, sht.price AS delivery_price, sht.country FROM Stores str INNER JOIN Products prd ON str.productId = prd.id INNER JOIN BiddingTransactions bt ON bt.storeId = str.id INNER JOIN Users usr ON bt.buyerId = usr.id LEFT JOIN ShippingDetails shd ON bt.buyerId = shd.userId LEFT JOIN ShippingTypes sht ON shd.shippingType = sht.id WHERE MD5(str.id) ='"+id+"'";
    console.log(sql);
    connection.query(sql,function(error,rows,fields){
        if(error){
            console.log(error);
        }else{
            response.ok(rows,res)
        }
    });
};
module.exports.detailRoomSendEmail = detailRoomSendEmail;
//end detail

//update setwinner
const updateSetWinner = async function(req,res){
    var id = req.body.id;
    var buyer_id = req.body.buyer_id;

    let sql = "UPDATE Stores SET userWinner='"+buyer_id+"' WHERE md5(id)='"+id+"'";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.updateSetWinner = updateSetWinner;
//end update setwinner

//add rate
const addRate = async function(req,res){
    var rateid = req.body.rateid;
    var userid = req.body.userid;
    var desc_rate = req.body.desc_rate;

    let sql = "INSERT INTO RatesApp (rateid, userid,desc_rate,create_date) VALUES ('"+rateid+"','"+userid+"','"+desc_rate+"','"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"')";
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                response.ok(rows,res)
            }
        });
};
module.exports.addRate = addRate;

//listrate
const listRate = async function(req,res){
    var userid = req.body.userid;
    var id = req.body.id;
    
    let sql = "SELECT rp.id,rp.rateid,rp.desc_rate,usr.first,usr.email FROM RatesApp rp INNER JOIN Users usr ON rp.userid = usr.id;";
    console.log(sql);
    connection.query(sql,function(error,rows,fields){
        if(error){
            console.log(error);
        }else{
            response.ok(rows,res)
        }
    });
};
module.exports.listRate = listRate;
//end detail


//total wins
const totalWin = async function(req,res){
    // var userid = req.body.userid;
    var id = req.body.id;
    connection.query("SELECT COUNT(id) AS total_win FROM Stores WHERE userWinner = ?",[id],function(error,rows,
        fields){
            if(error){
                console.log(error);
            }else{
                var data_json = JSON.stringify(rows);
            result = data_json.replace(/(^\[)/,'');
            result = result.replace(/(\]$)/,'');
            obj = JSON.parse(result);
            var total_win = obj.total_win;
            // console.log(obj.total_win)
                response.single(rows,res,total_win)
            }
        });
};
module.exports.totalWin = totalWin;