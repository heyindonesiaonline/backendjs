const swagJSDoc = require('swagger-jsdoc');

const CONFIG = require('./config');

const definition = {
  info: {
    title: 'REST API Swagger Auction - Bid Apps',
    version: '1.0.0',
    description: 'Documentation For Using Rest API Auction - Bid Apps',
  },
  host: 'localhost:' + CONFIG.port,
  basePath: '/', 
};

// options for the swagger docs
const options = {
    definition,
  apis: ['./api-doc/**/*.yaml'],
};
// initialize swagger-jsdoc
module.exports = swagJSDoc(options);