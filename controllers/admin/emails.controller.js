const { Emails } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');

const create = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, emails;

    let emails_data = req.body;
    
    [err, emails] = await to(Emails.create(emails_data));
    if(err) return ReE(res, err, 422);

    let emails_json = emails.toWeb();

    return ReS(res,{message: 'Success Add New Email', data:emails_json}, 201);
}

module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, emails;

    [err, emails] = await to(Emails.findAll());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load emails List', data:emails}, 201);
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    let err, emails;

    [err, emails] = await to(Emails.findOne({where: {id: req.params.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Detail Email', data:emails}, 201);
}
module.exports.get = get;

const update = async function(req, res){
    let err, emails, data;
    data = req.body;

    [err, emails] = await to(Emails.update(
        data,
        {where: {id: data.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, emails] = await to(Emails.findOne());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Update Detail Email', data:emails}, 201);
}
module.exports.update = update;

const remove = async function(req, res){
    let emails, err;

    [err, emails] = await to(Emails.destroy({
        where: {
          id: req.body.id
        }
      }));
      if(err) return ReE(res, err, 422);

    if(err) return ReE(res, 'error occured trying to delete the Email');

    return ReS(res, {message:'Successfully Delete Email', data:emails}, 201);
}
module.exports.remove = remove;