const { Categories } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');

const create = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, categories;

    let categories_data = req.body;
    
    [err, categories] = await to(Categories.create(categories_data));
    if(err) return ReE(res, err, 422);

    let categories_json = categories.toWeb();

    return ReS(res,{message: 'Success Add New Category', data:categories_json}, 201);
}

module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, categories;

    [err, categories] = await to(Categories.findAll());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Categories List', data:categories}, 201);
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    let err, categories;

    [err, categories] = await to(Categories.findOne({where: {id: req.params.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Detail Category', data:categories}, 201);
}
module.exports.get = get;

const update = async function(req, res){
    let err, categories, data;
    data = req.body;

    [err, categories] = await to(Categories.update(
        data,
        {where: {id: data.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, categories] = await to(Categories.findOne());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Update Detail Category', data:categories}, 201);
}
module.exports.update = update;

const remove = async function(req, res){
    let categories, err;

    [err, categories] = await to(Categories.destroy({
        where: {
          id: req.body.id
        }
      }));
      if(err) return ReE(res, err, 422);

    if(err) return ReE(res, 'error occured trying to delete the Category');

    return ReS(res, {message:'Successfully Delete Category', data:categories}, 201);
}
module.exports.remove = remove;