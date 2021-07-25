const { Keys } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');

const create = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, keys;

    let keys_data = req.body;
    
    [err, keys] = await to(Keys.create(keys_data));
    if(err) return ReE(res, err, 422);

    let keys_json = keys.toWeb();

    return ReS(res,{message: 'Success Add New Key', data:keys_json}, 201);
}

module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, keys;

    [err, keys] = await to(Keys.findAll());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Keys List', data: keys}, 201);
}

module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    
    let err, keys;

    [err, keys] = await to(Keys.findOne({where: {id: req.params.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Detail Key', data:keys}, 201);
}
module.exports.get = get;

const update = async function(req, res){
    let err, keys, data;
    data = req.body;

    [err, keys] = await to(Keys.update(
        data,
        {where: {id: data.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, keys] = await to(Keys.findOne({where: {id: data.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Update Detail Keys', data:keys}, 201);
}
module.exports.update = update;

const remove = async function(req, res){
    let keys_json, err;

    [err, keys] = await to(Keys.destroy({
        where: {
          id: req.body.id
        }
      }));
      if(err) return ReE(res, err, 422);

    if(err) return ReE(res, 'error occured trying to delete the keys');

    return ReS(res, {message:'Successfully Delete Keys', data:keys}, 201);
}
module.exports.remove = remove;