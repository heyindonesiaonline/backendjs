const { AppSetting } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');

const create = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, appsetting;
    let data = req.body;
    [err, appsetting] = await to(AppSetting.findOne());
    if(err) return ReE(res, err, 422);
    if(appsetting != null) return ReE(res, 'Sorry, Data App Setting Exist. You can\'t Create A New One', 422);
    if (Array.isArray(req.files) && req.files.length > 0 ) {
        req.files.forEach(function(img, index, arr) {
            if(img.fieldname == "appLogo") {
                data.appLogo = '/uploads/' + img.filename;
            }
            if(img.fieldname == "companyLogo") {
                data.companyLogo = '/uploads/' + img.filename;
            }
        });
    }

    [err, appsetting] = await to(AppSetting.create(data));

    if(err) return ReE(res, err, 422);

    let appsettings = appsetting.toWeb();

    return ReS(res,{message: 'Success Add App Settings', data:appsettings}, 201);
}
module.exports.create = create;

const update = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, appsetting;
    let data = req.body;
    if (Array.isArray(req.files) && req.files.length > 0 ) {
        req.files.forEach(function(img, index, arr) {
            if(img.fieldname == "appLogo") {
                data.appLogo = '/uploads/' + img.filename;
            }
            if(img.fieldname == "companyLogo") {
                data.companyLogo = '/uploads/' + img.filename;
            }
        });
    }

    [err, appsetting] = await to(AppSetting.update(data, {where: {id: data.id} }));

    if(err) return ReE(res, err, 422);

    [err, appsetting] = await to(AppSetting.findOne());

    if(err) return ReE(res, err, 422);

    let appsettings = appsetting.toWeb();

    return ReS(res,{message: 'Success Update App Settings', data:appsettings}, 201);
}
module.exports.update = update;