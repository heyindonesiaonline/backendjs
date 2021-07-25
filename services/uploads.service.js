const { Uploads }    = require('../models');
const { to, TE }    = require('../services/util.service');
const path              = require('path');

const uploadFiles = async function(files, body) {
    let imgDatas = [];
    files.forEach(function(img, index, arr) {
        imgDatas.push({
            content : body.name,
            contentId : body.id,
            type: img.mimetype,
            name: img.originalname,
            data: '/uploads/' + img.filename
        });
    });
    [err, uploads] = await to(Uploads.bulkCreate(imgDatas));

    if(err) TE('Error Upload Files / Image To Database');

    return uploads;
}
module.exports.uploadFiles = uploadFiles;