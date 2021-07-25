const { Products } = require('../../models');
const { Uploads } = require('../../models');
const { uploadFiles } = require('../../services/uploads.service');
const { to, ReE, ReS } = require('../../services/util.service');

const create = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, product;

    let product_data = req.body;
    
    [err, product] = await to(Products.create(product_data));
    if(err) return ReE(res, err, 422);
    if (Array.isArray(req.files) && req.files.length > 0 ) {
        
        [errimg, img] = await to(uploadFiles(req.files, product));

        if(errimg) return ReE(res, errimg, 422);
    }

    let product_json = product.toWeb();

    return ReS(res,{message: 'Success Add New Product', data:product_json}, 201);
}

module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, product;

    [err, product] = await to(Products.findAll());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Products List', data:product}, 201);
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    let err, product;

    [err, product] = await to(Products.findOne({where: {id: req.params.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Detail Products', data:product}, 201);
}
module.exports.get = get;

const update = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, product, data, errdel, deldata, errimg, img;
    data = req.body;
    if (Array.isArray(req.files) && req.files.length > 0 ) {
        [errdel, deldata] = await to(Uploads.destroy({
            where: {
                contentId: data.id
            }
        }));
        
        [errimg, img] = await to(uploadFiles(req.files, data));

        if(errimg) return ReE(res, errimg, 422);
    }
    [err, product] = await to(Products.update(
        data,
        {where: {id: data.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, product] = await to(Products.findOne({where: {id: data.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Update Detail Product', data:product}, 201);
}
module.exports.update = update;

const remove = async function(req, res){
    let product, err;

    [err, product] = await to(Products.destroy({
        where: {
          id: req.body.id
        }
    }));
      if(err) return ReE(res, err, 422);

    if(err) return ReE(res, 'error occured trying to delete the Products');

    return ReS(res, {message:'Successfully Delete Role', data:product}, 201);
}
module.exports.remove = remove;

const changeImageProduct = async function (req, res) {
    
}
module.exports.changeImageProduct = changeImageProduct;