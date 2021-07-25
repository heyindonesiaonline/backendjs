const { inbox_notifies } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');

const listInboxNotRead = async function (req, res) {
    let err, data;
    let currUser = req.user.dataValues;

    [err, data] = await to(inbox_notifies.findAll({
        where: {
            read: 0,
            fcm_code: currUser.fcm_reg_code
        }
    }));

    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load list inbox', data:data}, 201);

}
module.exports.listInboxNotRead = listInboxNotRead;

const setHasbeenRead = async function (req, res) {
    let err, data;
    let currUser = req.user.dataValues;

    [err, data] = await to(inbox_notifies.update({
        read: 1
    }, {
        where: {
            fcm_code: currUser.fcm_reg_code,
            id: req.body.id
        }
    }));

    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Success Been Read', data:data}, 201);

}
module.exports.setHasbeenRead = setHasbeenRead;