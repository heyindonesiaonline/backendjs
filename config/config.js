require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'development';
CONFIG.port         = process.env.PORT  || '3033';

// Configuration For DB Connection Backend Apps
CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'auct_bid_prod_new';
CONFIG.db_user      = process.env.DB_USER       || 'root';
// CONFIG.db_password  = process.env.DB_PASSWORD   || '123456qwerty';
CONFIG.db_password  = process.env.DB_PASSWORD   || '';

// Configuration For DB Access Administration Truncate, Create DB, Drop, ect
CONFIG.dialect      = process.env.DB_DIALECT    || 'mysql';
CONFIG.host         = process.env.DB_HOST       || '127.0.0.1';
CONFIG.database      = process.env.DB_NAME      || 'auct_bid_prod_new';
CONFIG.port         = process.env.DB_PORT       || '3306';
CONFIG.username     = process.env.DB_USER       || 'root';
// CONFIG.password     = process.env.DB_PASSWORD   || '123456qwerty';
CONFIG.password     = process.env.DB_PASSWORD   || '';

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || '931fcdf9b28c8d9b272d806bc436507c';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

module.exports = CONFIG;