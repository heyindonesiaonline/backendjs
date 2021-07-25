const express      = require('express');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');

const v1    = require('./routes/v1');
const admin = require('./routes/admin');
const app   = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

const CONFIG = require('./config/config');

const swaggerUi = require('swagger-ui-express');
const swagadmin = require('./config/swagger');
const path              = require('path');

const cron = require('node-cron');
const fs = require('fs');

const autoSetWinner = require('./controllers/cron/setwinner.controller');
const notifNewProduct = require('./controllers/cron/newproduct.controller');

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/resources/static/assets'));

//Passport
app.use(passport.initialize());

const models = require("./models");
models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
})
.catch(err => {
    console.error('Unable to connect to SQL database:',err);
});
if(CONFIG.app==='dev'){
    models.sequelize.sync();
    // models.sequelize.sync({ force: true });
}

app.use(cors());

cron.schedule("0/5 * * * *", autoSetWinner.autoSetWinner);

cron.schedule("0/10 * * * *", notifNewProduct.newproductStartOn10Menuites);

cron.schedule("0 * * * *", autoSetWinner.remindCompleteOrderOneHours);

cron.schedule("0 * * * *", notifNewProduct.newproductStartOnOneHour);

cron.schedule("0 */3 * * *", autoSetWinner.remindCompleteOrderThreeHours);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagadmin));

app.use('/v1', v1);

app.use('/admin', admin);

app.use('/', function(req, res){
   res.statusCode = 200;//send the appropriate status code
   res.json({status:"success", message:"Auction Pending API", data:{}})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res);
});

// module.exports = app;

module.exports = {app: app, server: server};

process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});