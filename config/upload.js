const multer = require('multer');
const path              = require('path');
const __basedir = path.resolve();
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/resources/static/assets/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname.replace(/\s/g, '-'))
    }
});

var upload = multer({storage: storage});

module.exports = upload;