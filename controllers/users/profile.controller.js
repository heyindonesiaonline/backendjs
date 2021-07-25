const { User }          = require('../../models');
const { Stores }        = require('../../models');
const { BiddingTransactions } = require('../../models');
const { Products } = require('../../models');
const { to, ReE, ReS }  = require('../../services/util.service');

const { Op } = require('sequelize');

//declare
var response = require('../../response/res');
var connection = require('../../config/conn');
//

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    let err, currUser;
    currUser = req.user.dataValues;

    [err, users] = await to(User.findOne({
        where: {
          id: currUser.id
        }
    }));
    if(err) return ReE(res, err, 422);

    [err2, stores] = await to(Stores.findAll(
            { 
                where: {
                    startBid: {
                        [Op.lte]: new Date()
                    },
                    endBid: {
                        [Op.gte]: new Date()
                    }

                },
                include: [ 
                    { model: Products}, 
                    {
                        model: BiddingTransactions,
                        where: { buyerId: currUser.id }
                    }
                ]
            }
        )
    );

    if(err2) return ReE(res, err2, 422);

    return ReS(res, {message:'Successfully Load Detail Users', data:{users,stores}}, 201);
}
module.exports.get = get;

const update = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
    let err, user, data;
    user = req.user;
    data = req.body;
    user.set(data);
    //new code
    let sql = "UPDATE Users SET zipcode='"+req.body.zipPostCode+"' WHERE id="+req.body.id;
    console.log(sql);
    connection.query(sql,function(error,rows,
        fields){
        if(error){
            console.log(error);
        }else{
        }
    });
    //
    if (Array.isArray(req.files) && req.files.length > 0 ) {
        user.set({avatar : '/uploads/' + req.files[0].filename});
    }
    [err, user] = await to(user.save());
    if(err){
        if(err.message=='Validation error') err = 'The email address or phone number is already in use';
        return ReE(res, err);
    }
    return ReS(res, {message :'Updated User: '+user.email, data: user});
}
module.exports.update = update;