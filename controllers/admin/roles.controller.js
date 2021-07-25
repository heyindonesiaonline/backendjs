const { Roles } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');

const create = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, roles;

    let roles_data = req.body;
    
    [err, roles] = await to(Roles.create(roles_data));
    if(err) return ReE(res, err, 422);

    let roles_json = roles.toWeb();

    return ReS(res,{message: 'Success Add New Role', data:roles_json}, 201);
}

module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, roles;

    [err, roles] = await to(Roles.findAll());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Roles List', data:roles}, 201);
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    let err, roles;

    [err, roles] = await to(Roles.findOne({
        where: {
          id: req.params.id
        }
      }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Detail Roles', data:roles}, 201);
}
module.exports.get = get;

const update = async function(req, res){
    let err, roles, data;
    data = req.body;

    [err, roles] = await to(Roles.update(
        data,
        {where: {id: data.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, roles] = await to(Roles.findOne({where: {id: data.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Update Detail Roles', data:roles}, 201);
}
module.exports.update = update;

const remove = async function(req, res){
    let roles, err;

    [err, roles] = await to(Roles.destroy({
        where: {
          id: req.body.id
        }
      }));
      if(err) return ReE(res, err, 422);

    if(err) return ReE(res, 'error occured trying to delete the roles');

    return ReS(res, {message:'Successfully Delete Role', data:roles}, 201);
}
module.exports.remove = remove;