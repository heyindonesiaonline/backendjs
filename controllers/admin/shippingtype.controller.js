const { ShippingTypes } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const create = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, stype;

    let stype_data = req.body;
    
    [err, stype] = await to(ShippingTypes.create(stype_data));
    if(err) return ReE(res, err, 422);

    let stype_json = stype.toWeb();

    return ReS(res,{message: 'Success Add New Shipping Type', data:stype_json}, 201);
}

module.exports.create = create;

const update = async function(req, res){
    let err, stype, data;
    data = req.body;

    [err, stype] = await to(ShippingTypes.update(
        data,
        {where: {id: data.id} }
    ));
    if(err) return ReE(res, err, 422);

    [err, stype] = await to(ShippingTypes.findOne());

    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Update Detail Shipping Type', data:stype}, 201);
}
module.exports.update = update;

const remove = async function(req, res){
    let stype, err;

    [err, stype] = await to(ShippingTypes.destroy({
        where: {
          id: req.body.id
        }
    }));
    
    if(err) return ReE(res, err, 422);

    if(err) return ReE(res, 'error occured trying to delete the Shipping Type');

    return ReS(res, {message:'Successfully Delete Shipping Type', data:stype}, 201);
}
module.exports.remove = remove;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let limit = 10;
    let offset = 0;
    ShippingTypes.findAndCountAll().then((data) => {
        let page = req.params.page;
        let pages = Math.ceil(data.count / limit);
        offset = limit * ( page - 1 );
        ShippingTypes.findAll({
            limit: limit,
            offset: offset,
            order: [
                ['id', 'ASC']
            ]
        })
        .then((result) => {
            data = {'list': result, 'count': data.count, 'pages': pages};
            return ReS(res, {message:'Successfully Load Shipping Types List', data}, 201);
        });
    })
    .catch(function (err) {
        return ReE(res, err, 500);
	});

}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    let err, stype;

    [err, stype] = await to(ShippingTypes.findOne({where: {id: req.params.id} }));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load Detail Shipping Type', data:stype}, 201);
}
module.exports.get = get;

const searchST = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let err, stype;

    [err, stype] = await to(ShippingTypes.findAll(
            {
                where: {
                    [Op.or]: [
                        {
                            shippingCode: {
                                [Op.substring]: req.params.search
                            }
                        },
                        {
                            shippingName: {
                                [Op.substring]: req.params.search
                            }
                        },
                        {
                            country: {
                                [Op.substring]: req.params.search
                            }
                        },
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('shippingCode')), {[Op.substring]: req.params.search}),
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('shippingName')), {[Op.substring]: req.params.search}),
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('country')), {[Op.substring]: req.params.search})
                    ]
                }
                
            }
        )
    );
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Search Result Shipping Type', data:stype}, 201);
}
module.exports.searchST = searchST;

const userListShippingType = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    let err, stype;

    [err, stype] = await to(ShippingTypes.findAll({where: {
                price: {
                    [Op.or]: [
                        {
                            [Op.ne]: null
                        },
                        {
                            [Op.ne]: 0
                            
                        }
                    ]
                }
            } 
        }
    ));
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Successfully Load List Shipping Type', data:stype}, 201);

}
module.exports.userListShippingType = userListShippingType;